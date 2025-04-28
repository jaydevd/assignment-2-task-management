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
        const id = user.id;

        const { title, dueDate, page, projectId, userId, status, limit } = req.query;

        const skip = Number(page - 1) * limit;

        const validationObj = req.query;
        const validation = new Validator(validationObj, {
            title: VALIDATION_RULES.TASK.TITLE,
            dueDate: VALIDATION_RULES.TASK.DUE_DATE,
            projectId: VALIDATION_RULES.TASK.PROJECT_ID,
            userId: VALIDATION_RULES.TASK.USER_ID,
            STATUS: VALIDATION_RULES.TASK.STATUS
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const query = `
        SELECT t.id, t.title, t.status, t.due_date, t.user_id, t.created_at, u.name, p.name
        FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        JOIN projects p
        ON t.project_id = p.id
        `;

        const TITLE = ` AND t.title ILIKE '%${title}%'`;
        const DUE_DATE = ` AND t.due_date < '${dueDate}'`;
        const STATUS = ` AND t.status < '${status}`;
        const PROJECT = ` AND t.project_id = '${projectId}'`;
        const USER = ` AND t.user_id = '${userId}'`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;

        if (title) query += TITLE;
        if (dueDate) query += DUE_DATE;
        if (status) query += STATUS;
        if (projectId) query += PROJECT;
        if (userId) query += USER;
        query += LIMIT;

        const [tasks, metadata] = await sequelize.query(query);

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

        const query = `
        UPDATE tasks
        SET comments = comments || '[{"id": "${id}", "comment":"${comment}", "from":"${userId}"}]'::jsonb
        WHERE id = '${taskId}'
        `;
        const [result, metadata] = await sequelize.query(query);

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

        await client.zAdd('tasks', {
            score: id,
            value: `task:${id}`,
        });

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