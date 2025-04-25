/**
 * @name TaskController
 * @file TaskController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain methods for Tasks.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const { Task } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require('../../../config/redis');

const ListTasks = async (req, res) => {
    try {
        const user = req.user;
        const id = user[0].id;
        console.log(user, id);
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

        const validationObj = { id };
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.USER.id
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const rawQuery = `
        SELECT t.id, t.description, t.comments, t.status, t.due_date, t.user_id, t.created_at, u.name, p.name
        FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        JOIN projects p
        ON t.project_id = p.id
        WHERE t.is_active = true AND t.description ILIKE '%${query || ''}%' AND t.due_date ILIKE '%${dueDate || ''}%' AND
        t.status ILIKE '%${status || ''}%' AND t.project_id ILIKE '%${projectId || ''}%' AND t.user_id ILIKE '%${userId || ''}%'
        LIMIT ${limit || 10} OFFSET ${skip || 0}
        `;

        const [tasks, metadata] = await sequelize.query(rawQuery);

        if (!tasks) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'tasks not found',
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

        const { taskId, comment } = req.body;
        const user = req.user;
        const userId = user.id;

        const validationObj = { taskId, comment, from: userId };
        const validation = new Validator(validationObj, VALIDATION_RULES.COMMENT);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const id = uuidv4();

        const rawQuery = `
        UPDATE tasks
        SET comments = comments || '[{"id": "${id}", "comment":"${comment}", "from":"${userId}"}]'::jsonb
        WHERE id = '${taskId}'
        `;
        const [result, metadata] = await sequelize.query(rawQuery);

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            });
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
        })
    }
}

const UpdateTask = async (req, res) => {
    try {

        const { id, description, status, comments, dueDate } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, VALIDATION_RULES.TASK);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: ''
            })
        }
        const result = await Task.update({ status, description, comments, dueDate }, { where: { id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }

        const tasks = await Task.findAll({ attributes: ['id', 'status', 'description', 'projectId', 'userId', 'dueDate'], where: { isActive: true } });

        if (!tasks) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'tasks not found',
                data: '',
                error: ''
            })
        }

        client.del('tasks');
        client.set('tasks', JSON.stringify(tasks));

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
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

module.exports = {
    ListTasks,
    UpdateTask,
    Comment
}