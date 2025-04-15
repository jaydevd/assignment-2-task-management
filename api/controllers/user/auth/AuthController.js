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
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../models/validations');

const SignUp = async (req, res) => {

    try {
        const { name, email, password, age, gender, country, city, company } = req.body;

        const validationObj = req.body;
        let validation = new Validator(validationObj, VALIDATION_RULES.USER);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
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
            age,
            gender,
            country,
            city,
            company: company || null,
            createdBy: id,
            createdAt: Math.floor(Date.now() / 1000),
            isActive: true,
            isDeleted: false
        });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            data: result.id,
            message: 'Data Created Successfully',
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
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                data: '',
                message: 'Validation failed',
                error: validation.errors.all()
            })
        }

        const user = await User.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'email', 'password', 'age', 'gender', 'country', 'city', 'company', 'token']
        });

        if (!user) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: "User Not Found",
                data: "",
                error: ""
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                status: PAGE_NOT_FOUND,
                message: "Invalid Credentials",
                data: "",
                error: "Password doesn't match"
            })
        }

        const secretKey = process.env.SECRET_KEY;

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        const result = await User.update(
            { token: token },
            {
                where: {
                    id: user.id,
                },
            },
        );

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            data: { user, token },
            message: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: ''
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