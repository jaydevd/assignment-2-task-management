/**
 * @name signup/login/logout
 * @file UserAuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description UserSignUp method will create a new user, UserLogIn method will log in an existing user and UserLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Task } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');
const admin = require('firebase-admin');

const ListTasks = async (req, res) => {
    try {
        const { id, page } = req.body;

        const limit = 2;
        const skip = Number(page - 1) * limit;

        const cacheTasks = req.tasks;
        console.log(cacheTasks);

        if (cacheTasks) {
            return res.status(200).json({
                status: HTTP_STATUS_CODES.SUCCESS.OK,
                message: '',
                data: cacheTasks,
                error: ''
            })
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

        const tasks = await Task.findAll({ attributes: ['id', 'description', 'status', 'dueDate', 'userId', 'isActive'], where: { userId: id, isActive: true } });
        if (!tasks) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'tasks not found',
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
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

const Comment = async (req, res) => {
    try {

        const { taskID, comment, from, to, fcmToken } = req.body;
        const id = uuidv4();

        const rawQuery = `
        UPDATE tasks
        SET comments = comments || '[{"id": '${id}', "comment":'${comment}', "from":'${from}', "to": '${to}'}]'::jsonb
        WHERE id = '${taskID}'
        `;
        const [result, metadata] = await sequelize.query(rawQuery);

        if (!response) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            });
        }

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

const UpdateTask = async (req, res) => {
    try {
        const { id, description, status, comments, dueDate } = req.body;
        const result = await Task.update({ status, description, comments, dueDate }, { where: { id: id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: '',
                data: '',
                error: ''
            })
        }

        const payload = {
            notification: {
                title: 'Task Management System',
                body: "Task updated",
            },
            token: fcmToken,
        };

        const response = await admin.messaging().send(payload);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
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