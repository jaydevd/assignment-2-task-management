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
        const JOINED_AT = Math.floor(+Date.parse(joinedAt) / 1000);

        await User.create({
            id,
            name,
            email,
            phoneNumber,
            address,
            position,
            password: hashedPassword,
            gender,
            joinedAt: JOINED_AT,
            createdAt,
            createdBy,
            isActive: true,
            isDeleted: false
        });

        const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        await User.update({ token }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Sign up successful',
            data: token,
            error: ''
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
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

        const user = await User.findOne({ id, name, email, password, position, password, token, gender, joinedAt }, { where: { email, isActive: true } });
        if (!user) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "User Not Found",
                data: "",
                error: ""
            });
        } s

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "Invalid Credentials",
                data: "",
                error: "Password doesn't match"
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        client.set(`user:${id}`, user);

        await sequelize.query(`UPDATE users SET token = '${token}' WHERE id = '${user.id}'`);

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
            message: '',
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

        const token = jwt.sign({ email }, { expiresIn: '1h' });

        await User.update({ token }, { where: { email } });

        await sequelize.query(query);
        const URL = FORGOT_PASSWORD_URL.USER + `/:${token}`;

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
            message: '',
            data: '',
            error: error.message
        })
    }
}

const ResetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const hashedPassword = bcrypt.hash(password, 10);

        const query = `
        UPDATE users
        SET password = '${hashedPassword}'
        WHERE token = '${token}'
        `;

        await sequelize.query(query);
        await User.update({ password: hashedPassword }, { where: { token } });

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
            message: '',
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