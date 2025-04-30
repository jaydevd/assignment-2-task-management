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
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');
const { Task } = require('../../../models');

const ListTasks = async (req, res) => {
    try {

        const { title, page, status, userId, projectId, limit } = req.query;
        const skip = Number(page - 1) * limit;

        const validationObj = { title, dueDate, status };
        const validation = new Validator(validationObj, {
            title: VALIDATION_RULES.TASK.TITLE,
            dueDate: VALIDATION_RULES.TASK.DUE_DATE,
            status: VALIDATION_RULES.TASK.STATUS,
            userId: VALIDATION_RULES.TASK.USER_ID,
            projectId: VALIDATION_RULES.TASK.PROJECT_ID
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const date = Math.floor(Date.now() / 1000);

        const SELECT = `
        SELECT t.id, t.title, t.status, t.user_id, t.due_date, t.created_at, u.name as user, p.name as project
        FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        JOIN projects p
        ON t.project_id = p.id
        WHERE
        t.is_active = true AND
        t.user_id = '${userId}' AND
        t.project_id = '${projectId}' AND
        t.due_date >= '${date}'
        `;
        // const FROM = `FROM tasks t`;

        const query = SELECT;

        const TITLE = ` AND t.title ILIKE '%${title}%'`;
        const STATUS = ` AND t.status = '${status}'`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;

        if (title) query += TITLE;
        if (status) query += STATUS;

        query += LIMIT;

        const [tasks, metadata] = await sequelize.query(query);

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

        const { userId, title, dueDate, status, projectId } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            title: VALIDATION_RULES.TASK.TITLE,
            dueDate: VALIDATION_RULES.TASK.DUE_DATE,
            projectId: VALIDATION_RULES.TASK.PROJECT_ID,
            userId: VALIDATION_RULES.TASK.USER_ID,
            status: VALIDATION_RULES.TASK.STATUS
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const id = uuidv4();
        const createdAt = Math.floor(Date.now() / 1000);

        await Task.create({ id, title, dueDate, status, userId, projectId, createdAt, createdBy, isActive: true, isDeleted: false });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'task saved',
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

// change status, update task details
const UpdateTask = async (req, res) => {
    try {

        const { id, status, title, dueDate, projectId, userId } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.TASK.ID,
            title: VALIDATION_RULES.TASK.TITLE,
            dueDate: VALIDATION_RULES.TASK.DUE_DATE,
            projectId: VALIDATION_RULES.TASK.PROJECT_ID,
            userId: VALIDATION_RULES.TASK.USER_ID,
            status: VALIDATION_RULES.TASK.STATUS
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = Math.floor(Date.now() / 1000);

        await Task.update({ status, title, dueDate, projectId, userId, updatedAt, updatedBy }, { where: { id } });

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
        const admin = req.admin;
        const updatedBy = admin.id;
        const updatedAt = Math.floor(Date.now() / 1000)

        await Task.update({ isActive: false, isDeleted: true, updatedAt, updatedBy }, { where: { id } });

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
    DeleteTask,
    ListTasks
}