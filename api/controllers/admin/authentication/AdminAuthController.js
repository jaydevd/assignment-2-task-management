/**
 * @name admin login/logout
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */
const { Admin } = require("./../../../models/index");
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { Sequelize, Op } = require('sequelize');

const AdminLogIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({
            where: { email: email },
            attributes: ['id', 'name', 'email', 'password']
        });

        if (!admin) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: "Admin Not Found",
                data: "",
                error: ""
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
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

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            data: token,
            message: '',
            error: ''
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: error.message
        });
    }
}

const AdminLogOut = async (req, res) => {
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
    AdminLogIn,
    AdminLogOut
}