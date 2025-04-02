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
const { SubCategory } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');

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

const AddSubCategory = async (req, res) => {
    try {
        const { subCategory } = req.body;
        const id = uuidv4();

const result = await SubCategory.create(
            {
                id: id,
                subCategory: subCategory
            }
        );
        
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

const DeleteSubCategory = async (req, res) => {
    try {

        const { id } = req.body;
        const res = Categories.update({ is_active: false, is_deleted: true }, { where: { id: id } });

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
    GetSubCategories,
    AddSubCategory,
    DeleteSubCategory
}