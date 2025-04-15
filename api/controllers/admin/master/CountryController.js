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
const { Country } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { application } = require('express');

const AddCountry = async (req, res) => {
    try {
        console.log("Add Country");
        const { country, cities } = req.body;
        console.log(country);

        const id = uuidv4();
        const query = `
        INSERT INTO countries (id, name, sub_categories, isActive, isDeleted, createdAt, createdBy) VALUES
        ('${id}', '${country}','${cities || null}', true, false, ${Math.floor(Date.now() / 1000)}, '${id}');`;

        const [result, metadata] = await sequelize.query(query);

        if (!result) {
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
            data: result.id,
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

const AddCity = async (req, res) => {
    try {
        const { country, city } = req.body;
        const id = uuidv4();

        const query = `
        UPDATE countries
        SET cities = cities || '[{"id": ${id}, "name": "${city}"}]'::jsonb
        WHERE id = '${country}';`

        const [result, metadata] = sequelize.query(query);
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



const DeleteCountry = async (req, res) => {
    try {
        const { id } = req.body;
        const res = Country.update({ isActive: false, isDeleted: true }, { where: { id: id } });

        if (!res) {
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

const ListCountries = async (req, res) => {
    try {
        console.log("country api called!");

        // Pagination
        const { query, countryID, page } = req.query;
        const limit = 20;
        const skip = (page - 1) * limit;

        // List countries with filter
        const [countries, metadata] = await sequelize.query(`SELECT id, name, cities FROM countries WHERE name ILIKE '%${query || ''}%' AND id ILIKE '%${countryID || ''}%' LIMIT ${limit || 10} OFFSET ${skip || 0}`);

        if (!countries) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No countries found',
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

module.exports = {
    AddCountry,
    DeleteCountry,
    ListCountries,
    AddCity
}