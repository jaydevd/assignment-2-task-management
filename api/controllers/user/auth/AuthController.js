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
const client = require('../../../config/redis');
const { sequelize } = require('../../../config/database');

const SignUp = async (req, res) => {

    try {
        const { name, email, role, password } = req.body;

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
        const createdAt = new Date(Math.floor(Date.now() / 1000) * 1000);

        const result = await User.create({
            id,
            name,
            email,
            role,
            password: hashedPassword,
            createdBy: id,
            createdAt,
            isActive: true,
            isDeleted: false
        });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'unable to create user',
                data: '',
                error: ''
            });
        }

        const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        const response = await User.update({ token }, { where: { id } });

        if (!response) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'Unable to store token',
                data: '',
                error: ''
            });
        }

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
        SELECT u.id, u.name, u.email, u.password, u.token FROM users u
        WHERE u.is_active = true AND u.email = '${email}';
        `;
        const [user, metadata] = await sequelize.query(query);

        if (!user[0]) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "User Not Found",
                data: "",
                error: ""
            });
        }
        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "Invalid Credentials",
                data: "",
                error: "Password doesn't match"
            })
        }

        const secretKey = process.env.SECRET_KEY;

        const token = jwt.sign({ id: user[0].id }, secretKey, { expiresIn: '1h' });

        const result = await User.update({ token }, { where: { id: user[0].id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "token not saved",
                data: "",
                error: ""
            });
        }

        const taskQuery = `
        SELECT t.id, t.description, t.status, t.comments, t.due_date, t.user_id, u.name FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        WHERE u.id = '${user[0].id}'
        `;

        const [tasks, meta] = await sequelize.query(taskQuery);

        if (!tasks) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: "tasks not found",
                data: "",
                error: ""
            });
        }

        client.set('user', JSON.stringify(user));
        client.set('tasks', JSON.stringify(tasks));

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
        const reqUser = req.user;
        const token = reqUser.token;

        const validationObj = { token };
        const validation = new Validator(validationObj, { token: VALIDATION_RULES.USER.token });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                data: '',
                message: 'Validation failed',
                error: validation.errors.all()
            })
        }

        const user = await User.findOne({
            where: { token },
            attributes: ['id', 'token']
        });

        if ((token !== user.token)) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'No user found',
                data: '',
                error: ''
            })
        }

        const result = await User.update({ token: null }, { where: { id: user.id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'Unable to log out',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
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
    SignUp,
    LogIn,
    LogOut
}