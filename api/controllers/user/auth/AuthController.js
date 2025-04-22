/**
 * @name AuthController
 * @file AuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description methods to sign up, log in and log out as a user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { User, Task } = require('../../../models/index');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require('../../../config/redis');
const { sequelize } = require('../../../config/database');
const { startCronJobs } = require('../../../cron');
const { transporter } = require('../../../config/transporter');

const SignUp = async (req, res) => {

    try {
        const { name, email, password } = req.body;

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

        const result = await User.create({
            id,
            name,
            email,
            password: hashedPassword,
            createdBy: id,
            createdAt: Math.floor(Date.now() / 1000),
            isActive: true,
            isDeleted: false
        });

        startCronJobs(transporter, email, { });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            data: result.id,
            message: 'Sign up Successful',
            error: ''
        });

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

        const result = await User.update(
            { token: token },
            {
                where: {
                    id: user[0].id,
                },
            },
        );

        console.log(user[0].id);

        const taskQuery = `
        SELECT t.id, t.description, t.status, t.comments, t.due_date, t.user_id, u.name FROM tasks t
        JOIN users u
        ON t.user_id = u.id
        WHERE u.id = '${user[0].id}'
        `;
        const [tasks, meta] = await sequelize.query(taskQuery);
        console.log(tasks);

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
        console.log('token: ', token);

        const validationObj = { token };
        const validation = new Validator(validationObj, { token: VALIDATION_RULES.USER.token });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                data: '',
                message: 'Validation failed',
                error: validation.errors.all()
            })
        }

        const user = await User.findOne({
            where: { token: token },
            attributes: ['id', 'token']
        });

        if ((token !== user.token)) {
            return res.json({
                status: '400',
                message: 'No user found',
                data: '',
                error: ''
            })
        }

        await User.update({ token: null }, { where: { id: user.id } });

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
    SignUp,
    LogIn,
    LogOut
}