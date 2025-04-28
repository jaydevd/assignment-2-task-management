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
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require("../../../config/redis");
const { sequelize } = require("../../../config/database");

const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validationObj = req.body;

        let validation = new Validator(validationObj, {
            email: VALIDATION_RULES.ADMIN.EMAIL,
            password: VALIDATION_RULES.ADMIN.PASSWORD
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const query = `
        SELECT id, password FROM admins WHERE email = '${email}';
        `;

        const [result, metadata] = await sequelize.query(query);

        if (result.length() == 0) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "Admin Not Found",
                data: "",
                error: ""
            });
        }
        const admin = result[0];

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(403).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: "Password doesn't match",
                data: "",
                error: ""
            })
        }

        const token = jwt.sign({
            id: admin.id,
        }, process.env.SECRET_KEY, { expiresIn: '1h' });

        await sequelize.query(`UPDATE admins SET token = '${token}' WHERE id = '${admin.id}'`);

        client.set("admin", admin.id);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: token,
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

const LogOut = async (req, res) => {
    try {
        const admin = req.admin;
        const query = `
        UPDATE admins SET token = null WHERE id = '${admin.id}';
        `;

        await sequelize.query(query);
        client.del("admin");

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Logged out successfully',
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

const ForgetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const admin = req.admin;
        const id = admin.id;

        const query = `
        UPDATE admins SET password = '${password}' WHERE id='${id}';
        `;

        await sequelize.query(query);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'password updated',
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
    LogIn,
    LogOut,
    ForgetPassword
}