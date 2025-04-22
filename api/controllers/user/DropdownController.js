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
const { Country } = require('./../../models/index');
const { HTTP_STATUS_CODES } = require('./../../config/constants');
const { sequelize } = require('./../../config/database');
const { VALIDATION_RULES } = require('../../config/validations');

const GetCountries = async (req, res) => {
    try {
        console.log("country api called!");
        const query = `SELECT id, name FROM countries;`;
        const [countries, metadata] = await sequelize.query(query);

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

const GetCategories = async (req, res) => {
    try {

        const query = `SELECT id, name FROM categories;`;
        const [categories, metadata] = await sequelize.query(query);

        if (!categories) {
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
            data: categories,
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

const GetCities = async (req, res) => {
    try {

        const { country } = req.body;
        const validatorObj = req.body;
        const validation = new Validator(validatorObj, VALIDATION_RULES.COUNTRY.id);

        const query = `SELECT cities FROM countries WHERE name = '${country}';`;
        const [cities, metadata] = await sequelize.query(query);
        console.log(cities);

        if (!cities) {
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
            data: cities,
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

const GetSubCategories = async (req, res) => {
    try {

        const { category } = req.body;
        const validatorObj = req.body;

        const validation = new Validator(validatorObj, { category: VALIDATION_RULES.CATEGORY.name });
        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'Validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const query = `SELECT sub_categories FROM categories WHERE name = '${category}';`;
        const [subCategories, metadata] = await sequelize.query(query);

        if (!subCategories) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No sub categories found',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: subCategories,
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

module.exports = { GetCountries, GetCategories, GetCities, GetSubCategories }