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
const { Country } = require('../../../models/index');
const { HTTP_STATUS_CODES } = require('../../../config/constants');

const GetCountries = async (req, res) => {
    try {

        const countries = await Country.findAll({ attributes: ['id', 'name'] });
        console.log(countries);

        if (!countries) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: '',
                data: '',
                error: ''
            })
        }
        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: countries,
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

module.exports = { GetCountries }