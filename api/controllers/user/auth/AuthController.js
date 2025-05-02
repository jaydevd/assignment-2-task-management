/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to sign up, log in and log out as a user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES, FORGOT_PASSWORD_URL } = require('../../../config/constants');
const { VALIDATION_RULES } = require('../../../config/validations');
const { sequelize } = require('../../../config/database');
const { User } = require('../../../models');
const client = require('../../../config/redis');
const { SendPasswordResetMail } = require('../../../helpers/mail/ForgotPassword');

const SignUp = async (req, res) => {

    try {
        const { name, email, phoneNumber, position, address, password, gender, joinedAt } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.USER.NAME,
            email: VALIDATION_RULES.USER.EMAIL,
            password: VALIDATION_RULES.USER.PASSWORD,
            position: VALIDATION_RULES.USER.POSITION,
            address: VALIDATION_RULES.USER.ADDRESS,
            gender: VALIDATION_RULES.USER.GENDER,
            joinedAt: VALIDATION_RULES.USER.JOINED_AT,
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'Validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = uuidv4();
        const createdAt = Math.floor(Date.now() / 1000);

        await User.create({
            id,
            name,
            email,
            phoneNumber,
            address,
            position,
            password: hashedPassword,
            gender,
            joinedAt,
            createdAt,
            createdBy: id,
            isActive: true,
            isDeleted: false
        });

        const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        await User.update({ token }, { where: { id } });

        const user = {
            id, name, email, phoneNumber, gender, address, position, joinedAt
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Sign up successful',
            data: { token, user },
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

const LogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            email: VALIDATION_RULES.USER.EMAIL,
            password: VALIDATION_RULES.USER.PASSWORD
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'Validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const user = await User.findOne({ attributes: ['id', 'name', 'email', 'password', 'position', 'password', 'token', 'gender', 'joinedAt'] }, { where: { email, isActive: true } });
        if (!user) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "User Not Found",
                data: "",
                error: ""
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "Password doesn't match",
                data: "",
                error: ""
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        client.set(`user:${user.id}`, JSON.stringify(user));

        await User.update({ token }, { where: { id: user.id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'log in successful',
            data: token,
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
        const user = req.user;
        const updatedBy = user.id;
        const updatedAt = Math.floor(Date.now() / 1000);

        await User.update({ token: null, updatedBy, updatedAt }, { where: { id } });

        client.del(`user:${id}`, user);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Logged out successfully',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const validationObj = { email };
        const validation = new Validator(validationObj, {
            email: VALIDATION_RULES.USER.EMAIL
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: VALIDATION_RULES.errors.all()
            })
        }

        const user = await User.findOne({ attributes: ['email'], where: { email } });

        if (!user) {
            return res.status(403).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: 'user not found',
                data: '',
                error: ''
            })
        }

        const token = uuidv4();

        await User.update({ token }, { where: { email } });

        const URL = FORGOT_PASSWORD_URL.USER + `/:${token}`;

        SendPasswordResetMail(URL, email);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'token generated',
            data: URL,
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
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ attributes: ['id', 'token'] }, { where: { token } });

        if (!user) {
            return res.status(403).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
                message: 'user not found',
                data: '',
                error: ''
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const updatedAt = Math.floor(Date.now() / 1000);
        const updatedBy = user.id;

        await User.update({ password: hashedPassword, updatedAt, updatedBy, token: null }, { where: { id: user.id } });

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
    SignUp,
    LogIn,
    LogOut,
    ForgotPassword,
    ResetPassword
}