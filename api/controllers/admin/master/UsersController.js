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

const ListUsers = async (req, res) => {
    try {
        const { country, city, query, page } = req.query;
        const limit = 2;
        const skip = Number(page - 1) * limit;

        const rawQuery = `
        SELECT u.id, u.name, u.email, c.name AS country, city_obj->>'name' AS city, u.gender, u.age, u.company
        FROM users u
        JOIN countries c ON u.country = c.id
        JOIN LATERAL jsonb_array_elements(c.cities) AS city(city_obj)
        ON city_obj->>'id' = u.city
        WHERE (u.name ILIKE '%${query || ''}%' OR u.email ILIKE '%${query || ''}%') AND c.name ILIKE '%${country || ''}%' AND city_obj->>'name' ILIKE '%${city || ''}%'
        LIMIT ${limit || ''} OFFSET ${skip || 0}
        `;

        const [users, metadata] = await sequelize.query(rawQuery);

        if (!users) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'No users found',
                data: '',
                error: ''
            });
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: users,
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

const UpdateUser = async (req, res) => {
    try {
        const { id, name, country, city, gender, age, company } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, VALIDATION_RULES.USER);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }
        const result = await User.update({
            name: name,
            country: country,
            city: city,
            gender: gender,
            age: age,
            company: company || null
        }, {
            where: { id: id }
        })

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'user not updated',
                data: '',
                error: ''
            })
        }
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'user updated',
            data: result,
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

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }
        const result = await User.update({ isActive: false, isDeleted: true }, { where: { id: id } });

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

module.exports = {
    ListUsers,
    UpdateUser,
    DeleteUser
}