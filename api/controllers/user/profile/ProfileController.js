/**
 * @name signup/login/logout
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */
const { User } = require('./../../../models/index');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { Sequelize, Op, where } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');

const UpdateProfile = async (req, res) => {

    try {
        const { id, name } = req.body;

        const validationObj = req.body;
        let validation = new Validator(validationObj, VALIDATION_RULES.USER);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                data: '',
                message: 'validation failed',
                error: validation.errors.all()
            })
        }

        const verifyID = await User.findOne({ attributes: ['id'], where: { id: id } });

        if (!verifyID) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'id not found',
                data: '',
                error: ''
            })
        }

        const result = await User.update({
            name,
            gender,
            age,
            country,
            city,
            company,
            updatedAt: Math.floor(Date.noe() / 1000),
            updatedBy: id
        }, { where: { id: id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            data: result.id,
            message: 'Data Created Successfully',
            error: ''
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: error.message
        })
    }
}

module.exports = { UpdateProfile }