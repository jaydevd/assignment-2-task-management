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
const { User, Task } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../models/validations');

const GetTasks = async (req, res) => {
    try {
        const { id } = req.body;
        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.USER.id
        })

        const tasks = await Task.findOne({ attributes: ['id', 'title', 'taskList', 'dueDate', 'user', 'isActive'], where: { user: id } });

        if (!isActive) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: 'Task deleted',
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

        // const { comment } = req.body;
        const [result, metadata] = sequelize.query

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: '',
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

const UpdateTask = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await Task.update({ isActive: false, isDeleted: true }, { where: { id: id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: '',
                data: '',
                error: ''
            })
        }
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: '',
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

module.exports = {
    GetTasks,
    UpdateTask,
    Comment
}