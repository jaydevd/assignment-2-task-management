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
const { Account } = require('./../../../models/index');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { VALIDATION_RULES } = require('../../../models/validations');
const { sequelize } = require('../../../config/database');

const CreateAccount = async (req, res) => {
    try {
        const { name, category, subCategory } = req.body;

        const reqUser = req.user;
        const userID = reqUser.id;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.ACCOUNT.name,
            category: VALIDATION_RULES.ACCOUNT.category,
            subCategory: VALIDATION_RULES.ACCOUNT.subCategory
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                data: '',
                message: 'Invalid Credentials',
                error: validation.errors.all()
            })
        }

        const id = uuidv4();

        const account = await Account.create({
            id: id,
            name: name,
            category: category,
            subCategory: subCategory,
            createdBy: userID,
            createdAt: Math.floor(Date.now() / 1000),
            isActive: true,
            isDeleted: false
        });

        return res.status(200).json({
            status: '200',
            message: "",
            data: account.id,
            error: ""
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: '500',
            message: "",
            data: '',
            error: ""
        });
    }
}

const ListAccounts = async (req, res) => {
    try {
        console.log("List Accounts api");

        // List accounts with filter
        const { category, subCategory, query, page } = req.query;

        const reqUser = req.user;
        const userID = reqUser.id;

        const limit = 5;
        const skip = Number(page - 1) * limit;
        console.log("skip: ", skip);

        console.log("ListUsers API");

        const rawQuery = `
        SELECT a.id, a.name, c.name AS category, sub_cat_obj->>'name' AS sub_category
        FROM accounts a
        JOIN categories c ON a.category = c.id
        JOIN LATERAL jsonb_array_elements(c.sub_categories) AS sub_category(sub_cat_obj)
        ON sub_cat_obj->>'id' = a.sub_category
        WHERE a.created_by = '${userID}' AND a.name ILIKE '%${query || ''}%' AND c.name ILIKE '%${category || ''}%' AND sub_cat_obj->>'name' ILIKE '%${subCategory || ''}%'
        LIMIT ${limit || 10} OFFSET ${skip || 0}
        `;

        const [accounts, metadata] = await sequelize.query(rawQuery);

        if (!accounts) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR,
                message: 'No accounts found',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: accounts,
            error: ''
        });

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

const UpdateAccount = async (req, res) => {
    try {

        const { id, name, category, subCategory } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, VALIDATION_RULES.ACCOUNT);

        const result = await Account.update({
            name: name,
            category: category,
            subCategory: subCategory,
            updatedAt: Math.floor(Date.now() / 1000),
            updatedBy: id
        }, { where: { id: id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: "",
            data: result.id,
            error: ""
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: INTERNAL_SERVER_ERROR,
            message: "",
            data: '',
            error: ""
        })
    }
}

const DeleteAccount = async (req, res) => {
    try {

        const { id } = req.body;
        const result = await Account.update({ isActive: false, isDeleted: true }, { where: { id: id } });

        return res.status(200).json({
            status: '200',
            message: "",
            data: '',
            error: ""
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: "",
            data: "",
            error: error.message
        })
    }
}

module.exports = {
    CreateAccount,
    ListAccounts,
    UpdateAccount,
    DeleteAccount
};