/**
 * @name signup/login/logout
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */
const { User } = require('./../../../models/index');
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { Sequelize, Op } = require('sequelize');

const EditProfile = async (req, res) => {

    try {
        const { id, name, gender, age, country, city, company } = req.body;

        let validation = new Validator({
            id: id,
            name: name,
            age: age,
            gender: gender,
            country: country,
            city: city,
            company: company
        },
            {
                id: 'required',
                name: 'required',
                gender: 'required',
                age: 'required',
                country: 'required',
                city: 'required',
                company: 'mxa:64'
            }
        )

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                data: '',
                message: 'Invalid Credentials',
                error: validation.errors.all()
            })
        }

        const result = await User.update({
            name: name,
            gender: gender,
            age: age,
            country: country,
            city: city,
            company: company,
            updatedAt: Math.floor(Date.noe() / 1000),
            updatedBy: id
        }, { where: { id: id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            data: result.id,
            message: 'Data Created Successfully',
            error: ''
        })
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

module.exports = { EditProfile }