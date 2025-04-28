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
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { VALIDATION_RULES } = require('../../../config/validations');
const { sequelize } = require('../../../config/database');

const SignUp = async (req, res) => {

    try {
        const { name, email, phoneNumber, position, address, password, gender, joinedAt } = req.body;

        const validationObj = req.body;
        let validation = new Validator(validationObj, VALIDATION_RULES.USER);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                data: '',
                message: 'Validation failed',
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
            data: token,
            message: 'Sign up successful',
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
        const validation = new Validator(validationObj, { email: VALIDATION_RULES.USER.email, password: VALIDATION_RULES.USER.password });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                data: '',
                message: 'Validation failed',
                error: validation.errors.all()
            })
        }

        const query = `
        SELECT u.id, u.email, u.password, u.token FROM users u
        WHERE u.is_active = true AND u.email = '${email}';
        `;
        const [response, metadata] = await sequelize.query(query);

        if (result.length() == 0) {
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

        const secretKey = process.env.SECRET_KEY;

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        const result = await User.update({ token }, { where: { id: user.id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "token not saved",
                data: "",
                error: ""
            });
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            data: { user, token },
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

module.exports = {
    SignUp,
    LogIn,
    LogOut
}