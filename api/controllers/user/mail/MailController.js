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
const { User } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');

const SendMail = async (req, res) => {
    try {

        const users = await User.findAll({ attributes: ['name', 'email'] }, { where: { role: admin } });
        const query = `
        SELECT u.id AS user_id, u.name AS user_name, u.role, t.id AS task_id, t.title AS task_title, t.projectId
        FROM users u
        JOIN tasks t ON u.id = t.userId
        JOIN projects p ON t.projectId = p.id
        WHERE u.role = 'employee' AND
        u.id = ANY(p.members);
        `;
        const [mailContent, metadata] = await sequelize.query(query);

        if (!mailContent) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'No users found',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: '',
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

module.exports = { SendMail }