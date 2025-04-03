/**
 * @name GetSubCategories
 * @file CategoryController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will be controlling the getcategories api.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SubCategory } = require('../../../models/index');
const { HTTP_STATUS_CODES } = require('../../../config/constants');

const GetSubCategories = async (req, res) => {
    try {
        const categories = await SubCategory.findAll({
            attributes: ['sub_category']
        });
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

module.exports = { GetSubCategories }