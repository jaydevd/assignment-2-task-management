/**
 * @name create admin
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */
const { Admin, User, CountriesCities, Categories } = require("../models/index");
const { v4: uuidv4 } = require('uuid');
const Validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('./constants');
const { Sequelize, Op } = require('sequelize');

module.exports.bootstrap = async () => {
    try {

        const result = Admin.findAll({ attributes: ['id', 'name', 'email', 'password'] }, { limit: 1 });
        if (!result) {
            const name = "Admin";
            const password = "1234";
            const hashedPassword = bcrypt.hash(password, 10);

            const response = await Admin.create({
                id: id,
                name: name,
                email: email,
                password: hashedPassword,
                gender: gender,
                created_at: Math.floor(Data.now() / 1000),
                created_by: id,
                is_active: true,
                is_deleted: false
            });
        }
    } catch (error) {
        throw new Error(error);
    }
};