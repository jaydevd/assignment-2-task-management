/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to sign up, log in and log out as a user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { User, Task } = require('../../../models/index');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require('../../../config/redis');
const { sequelize } = require('../../../config/database');
const { startCronJobs } = require('../../../cron');
const { transporter } = require('../../../config/transporter');

const SendMails = async (req, res) => {
    try {

        const query = `
        SELECT u.email, t.description, t.due_date, t.status FROM users u 
        JOIN tasks t ON u.id = t.user_id
        WHERE t.due_date <= NOW() + INTERVAL 1 DAY AND t.status = 'pending' AND t.is_active = true AND u.is_active = true
        `;
        const [users, metadata] = await sequelize.query(query);
        if (!users || users.length === 0) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'No tasks found',
                data: '',
                error: ''
            });
        }
        startCronJobs(transporter, users);

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

module.exports = { SendMails };