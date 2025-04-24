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
const client = require('../../../config/redis');

const ListProjects = async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;
        console.log(user, id);
        const { query, page } = req.query;

        const limit = 2;
        const skip = Number(page - 1) * limit;

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
        SELECT p.id, p.name
        FROM projects p
        WHERE '${id}' = ANY(p.members) AND p.name ILIKE '%${query || ''}%'
        LIMIT ${limit || 10} OFFSET ${skip || 0}
        `;

        const [projects, metadata] = await sequelize.query(rawQuery);

        if (!projects) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'tasks not found',
                data: '',
                error: ''
            })
        }

        client.set('projects', JSON.stringify(projects));

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: projects,
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

module.exports = {
    ListProjects
}