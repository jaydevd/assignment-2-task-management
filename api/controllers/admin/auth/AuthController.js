/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to log in and log out as an admin
 * @author Jaydev Dwivedi (Zignuts)
 */

const { Admin } = require("../../../models/index");
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');

const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validationObj = req.body;

        let validation = new Validator(validationObj, {
            email: VALIDATION_RULES.ADMIN.email,
            password: VALIDATION_RULES.ADMIN.password
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                data: '',
                message: 'Validation failed',
                error: validation.errors.all()
            })
        }

        console.log("Validation passed");

        const admin = await Admin.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'email', 'password']
        });

        if (!admin) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "Admin Not Found",
                data: "",
                error: ""
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "Invalid Credentials",
                data: "",
                error: "Password doesn't match"
            })
        }

        const token = jwt.sign({
            id: admin.id,
        }, process.env.SECRET_KEY, { expiresIn: '1h' });

        await Admin.update(
            { token: token },
            {
                where: {
                    id: admin.id,
                },
            },
        );

        console.log("Token stored");

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            data: token,
            message: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: error.message
        });
    }
}

const LogOut = async (req, res) => {
    try {
        const reqAdmin = req.body.admin;
        const token = reqAdmin.token;

        if (!token) {
            res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No token found',
                data: '',
                error: ''
            })
        }

        const validationObj = { token };
        const validation = new Validator(validationObj, VALIDATION_RULES.ADMIN.token);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const admin = await Admin.findOne({
            where: { token: token },
            attributes: ['id', 'token']
        })

        if (token !== admin.token) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No user found',
                data: '',
                error: ''
            })
        }

        const result = Admin.update({ token: null }, { where: { id: admin.id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'Admin not found',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: 'Logged out successfully',
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
    LogIn,
    LogOut
}