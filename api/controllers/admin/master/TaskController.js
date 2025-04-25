/**
 * @name TaskController
 * @file TaskController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain Task management methods.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const { Task } = require('../../../models/index');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require('../../../config/redis');

const ListTasks = async (req, res) => {
    try {

        const { query, dueDate, page, projectId, userId, status } = req.query;
        const limit = 2;
        const skip = Number(page - 1) * limit;

        const cachedTasks = await client.zRange('tasks', skip, end);

        if (cachedTasks) {

            let tasks = await Promise.all(
                cachedTasks.map(task => client.hGetAll(task.id))
            );

            if (query) {
                tasks = tasks.filter(task => task.description == query || task.due_date == query);
            }

            return res.status(200).json({
                status: HTTP_STATUS_CODES.SUCCESS.OK,
                message: '',
                data: tasks,
                error: ''
            });
        }

        const validationObj = { dueDate, projectId, userId, status };
        const validation = new Validator(validationObj, VALIDATION_RULES.TASK);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const rawQuery = `
        SELECT t.id, t.description, t.comments, t.status, t.user_id, t.due_date, t.created_at, u.name as user, p.name as project
        FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        JOIN projects p
        ON t.project_id = p.id
        WHERE t.is_active = true AND t.description ILIKE '%${query || ''}%' AND t.project_id ILIKE '%${projectId || ''}%' AND t.user_id ILIKE '%${userId || ''}%'
        LIMIT ${limit || 10} OFFSET ${skip || 0}
        `;

        const [tasks, metadata] = await sequelize.query(rawQuery);

        if (!tasks) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }

        await Promise.all(
            tasks.map(task =>
                client.hSet(`task:${task.id}`, task)
            )
        );

        await client.zAdd('tasks', tasks.map(task => ({
            score: task.id,
            value: `task:${task.id}`,
        })));

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: tasks,
            error: ''
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const AssignTask = async (req, res) => {
    try {
        const admin = req.admin;
        const createdBy = admin.id;

        const { userId, description, dueDate, status, comments, projectId } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, VALIDATION_RULES.TASK);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const id = uuidv4();
        const createdAt = new Date(Math.floor(Date.now() / 1000) * 1000);

        const result = await Task.create({
            id,
            description,
            dueDate,
            userId,
            status,
            projectId,
            comments: comments || null,
            createdAt,
            createdBy,
            isActive: true,
            isDeleted: false
        });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'data not inserted',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'task saved',
            data: result.id,
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const Comment = async (req, res) => {
    try {

        const { taskID, comment, from } = req.body;
        const id = uuidv4();

        const validationObj = req.body;
        const validation = new Validator(validationObj, VALIDATION_RULES.COMMENT);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const rawQuery = `
        UPDATE tasks
        SET comments = comments || '[{"id": '${id}', "comment":'${comment}', "from":'${from}']'::jsonb
        WHERE id = '${taskID}'
        `;
        const result = await sequelize.query(rawQuery);

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'comment not saved',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'comment saved',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        });
    }
}

// change status, update task details
const UpdateTask = async (req, res) => {
    try {

        const { id, status, description, dueDate } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, VALIDATION_RULES.TASK);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const date = new Date(dueDate);
        const dueDateISO = date.toISOString();

        const rawQuery = `
        UPDATE tasks
        SET status = '${status}', description = '${description}', due_date = '${dueDateISO}'
        WHERE id = '${id}';
        `;
        const result = await sequelize.query(rawQuery);

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'task not updated',
                data: '',
                error: ''
            });
        }

        const query = `
        SELECT t.id, t.description, t.comments, t.status, t.user_id, t.due_date, t.created_at, u.name as user, p.name as project
        FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        JOIN projects p
        ON t.project_id = p.id
        WHERE t.is_active = true
        `
        const tasks = await sequelize.query(query);
        client.set('tasks', JSON.stringify(tasks));

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'task updated',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const DeleteTask = async (req, res) => {
    try {

        const { id } = req.body;
        const result = await Task.update({ isActive: false, isDeleted: true }, { where: { id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'task not deleted',
                data: '',
                error: ''
            });
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'task deleted',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        });
    }
}

module.exports = {
    AssignTask,
    UpdateTask,
    Comment,
    DeleteTask,
    ListTasks
}