/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to log in and log out as an admin
 * @author Jaydev Dwivedi (Zignuts)
 */

const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES, FORGOT_PASSWORD_URL } = require('../../../config/constants');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require("../../../config/redis");
const { SendPasswordResetMail } = require('../../../helpers/mail/ForgotPassword');
const { Admin } = require('../../../models');

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

        const admin = await Admin.findOne({ attributes: ['id', 'name', 'email', 'password'], where: { email } });

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

        await Admin.update({ token }, { where: { id: admin.id } });

        client.set(`admin:${admin.id}`, JSON.stringify(admin));

        const data = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            token
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: data,
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        });
    }
}

const LogOut = async (req, res) => {
    try {
        const admin = req.admin;
        const id = admin.id;
        const updatedAt = Math.floor(Date.now() / 1000);

        await Admin.update({ token: null, updatedAt, updatedBy: id }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Logged out successfully',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const token = uuidv4();

        await Admin.update({ token }, { where: { email } });

        const URL = FORGOT_PASSWORD_URL.ADMIN + `/:${token}`;

        SendPasswordResetMail(URL, email);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'token generated',
            data: '',
            error: ''
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const hashedPassword = bcrypt.hash(password, 10);

        await Admin.update({ password: hashedPassword }, { where: { token } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'password reset successfully',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

module.exports = {
    LogIn,
    LogOut,
    ForgotPassword,
    ResetPassword
}