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
const { User } = require('../../models');
const { HTTP_STATUS_CODES } = require('../../config/constants');
const { sequelize } = require('./../../config/database');

const GetUsers = async (req, res) => {
    try {

        const query = `SELECT id, name FROM users;`;
        const [users, metadata] = await sequelize.query(query);

        if (!users) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: '',
                data: '',
                error: ''
            });
        }
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: users,
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
    GetUsers
}