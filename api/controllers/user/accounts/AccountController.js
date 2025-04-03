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

const CreateAccount = async (req, res) => {
    try {
        const { id, name, category, subCategory, description } = req.body;
        let validation = new Validator({
            id: id,
            name: name,
            category: category,
            subCategory: subCategory,
            description: description
        },
            {
                name: 'required',
                category: 'required',
                subCategory: 'required',
                description: 'max:500'
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

        const accountID = uuidv4();
        const account = await Account.create({
            id: accountID,
            name: name,
            category: category,
            subCategory: subCategory,
            description: description,
            createdBy: id,
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
        const { id } = req.query;
        console.log(id);
        const accounts = await Account.findAll({
            attributes: ['id', 'name', 'category', 'sub_category', 'isActive', 'createdBy'],
            where: { createdBy: id, isActive: true }
        }
        );
        console.log("accounts: ", accounts);

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

const FilterAccounts = async (req, res) => {

    try {
        const { category, subCategory } = req.params;
        const accounts = await Account.findAll({ where: { category: category, subCategory: subCategory || { [Op.like]: `%%` } } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: "",
            data: accounts,
            error: ""
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

const SearchAccount = async (req, res) => {
    try {
        const { query } = req.params;

        const accounts = await Account.findAll({
            attributes: ['name', 'category', 'subCategory'],
        }, { where: { name: { [Op.like]: `%${query}%` } } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS,
            message: '',
            data: accounts,
            error: ''
        })
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

module.exports = {
    CreateAccount,
    ListAccounts,
    UpdateAccount,
    DeleteAccount,
    FilterAccounts,
    SearchAccount
};