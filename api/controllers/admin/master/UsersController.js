/**
 * @name signup/login/logout
 * @file UserAuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description UserSignUp method will create a new user, UserLogIn method will log in an existing user and UserLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');

const ListUsers = async (req, res) => {
    try {
        const { page } = req.query;
        const limit = 20;
        const skip = (page - 1) * limit;

        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'country', 'city', 'gender', 'age', 'company']
        }, { offset: skip, limit: limit });

        if (!users) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No users found',
                data: '',
                error: ''
            });
        }

        return res.status(200).json({
            status: '200',
            message: '',
            data: users,
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message()
        })
    }
}

const SearchUsers = async (req, res) => {
    try {
        let query = req.query["query"];
        console.log(query);
        query = query.toLowerCase();

        const users = await User.findAll({
            where: {
                [Op.or]: [{ name: { [Op.iLike]: `%${query}%` } }, { email: { [Op.iLike]: `%${query}%` } }]
            },
            attributes: ['id', 'name', 'email', 'age', 'gender', 'country', 'city', 'company']
        });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: users,
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

const EditUser = async (req, res) => {
    try {
        const { id, name, country, city, gender, age, company } = req.body;

        let validation = new Validator({
            id: id,
            name: name,
            gender: gender,
            country: country,
            city: city,
            gender: gender,
            age: age,
            company: company
        },
            {
                id: 'required',
                name: 'required',
                gender: 'required',
                country: 'required',
                city: 'required',
                gender: 'required',
                age: 'required',
                company: 'max:64'
            }
        )

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: '',
                data: '',
                error: ''
            })
        }
        const result = await User.update({
            name: name,
            country: country,
            city: city,
            gender: gender,
            age: age,
            company: company || null
        }, {
            where: { id: id }
        })
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: result,
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

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: '',
                data: '',
                error: ''
            })
        }
        const result = await User.update({ is_active: false, is_deleted: true }, { where: { id: id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
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
    ListUsers,
    EditUser,
    DeleteUser,
    SearchUsers
}