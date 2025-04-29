/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to sign up, log in and log out as a user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { User } = require('../../../models/index');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES, FORGOT_PASSWORD_URL } = require('../../../config/constants');
const { VALIDATION_RULES } = require('../../../config/validations');
const { sequelize } = require('../../../config/database');

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

        const query = `
        INSERT INTO users
            (id, name, email, phone_number, address, position, password, gender, joined_at, created_at, created_by, is_active, is_deleted)
        VALUES
            ('${id}','${name}', '${email}', '${phoneNumber}', '${address}', '${position}', '${hashedPassword}', '${gender}', '${joinedAt}', '${createdAt}', '${id}', true, false)
        `;

        await sequelize.query(query);

        const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        await sequelize.query(`UPDATE users SET token = '${token}' WHERE id = '${id}'`);

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

        const query = `
        SELECT u.id, u.email, u.password, u.token FROM users u
        WHERE u.is_active = true AND u.email = '${email}';
        `;
        const [response, metadata] = await sequelize.query(query);

        if (response == []) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "User Not Found",
                data: "",
                error: ""
            });
        }

        const user = response[0];

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
        client.set("user", user.id);

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

        const query = `UPDATE users SET token = NULL WHERE id = '${id}'`;
        await sequelize.query(query);

        client.del("user");

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

        const token = jwt.sign({ email }, { expiresIn: '1hr' });

        const query = `
        UPDATE users SET token = '${token}' WHERE email = '${email}';
        `;

        await sequelize.query(query);
        const URL = FORGOT_PASSWORD_URL.USER + `:${token}`;

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