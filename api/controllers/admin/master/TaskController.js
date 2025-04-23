/**
 * @name TaskController
 * @file TaskController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain Task management APIs.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Task } = require('../../../models/index');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');

const ListTasks = async (req, res) => {
    try {

        const { query, dueDate, page, projectId, userId } = req.query;
        const limit = 2;
        const skip = Number(page - 1) * limit;

        const rawQuery = `
        SELECT t.id, t.description, t.comments, t.status, t.user, t.created_at
        FROM tasks t
        JOIN admins a
        ON t.created_by = a.id
        WHERE t.is_active = true AND t.description ILIKE '%${query || ''}%' AND due_date ILIKE '%${dueDate}%'
        LIMIT ${limit || ''} OFFSET ${skip || 0}
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
        const adminID = admin.id;

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
        // console.log(createdAt);

        const result = await Task.create({
            id,
            description,
            dueDate,
            userId,
            status,
            projectId,
            comments: comments || null,
            createdAt,
            createdBy: adminID,
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
            message: 'data inserted',
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

        const { id, status, description, comment, dueDate } = req.body;

        const rawQuery = `
        UPDATE tasks
        SET status = '${status}', description = '${description}', comments = comments || '${comment}', due_date = '${dueDate}'
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
        const result = await Task.update({ isActive: false, isDeleted: true }, { where: { id: id } });

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