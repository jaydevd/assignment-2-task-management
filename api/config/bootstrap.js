/**
 * @name create admin
 * @file bootstrap.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description AdminSignUp method will create a new user, AdminLogIn method will log in an existing user and AdminLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { Admin } = require("../models/index");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { VALIDATION_RULES } = require("./validations");
const Validator = require('validatorjs');

module.exports.bootstrap = async () => {
    try {
        const admin = await Admin.findAll({ attributes: ['id', 'name', 'email', 'password'] }, { limit: 1 });

        if (Object.keys(admin).length != 0) return;

        const id = uuidv4();
        const name = "Test User";
        const email = "test@gmail.com"
        const password = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdAt = new Date(Math.floor(Date.now() / 1000) * 1000);

        const validationObj = { id, name, email, password: hashedPassword };
        console.log(validationObj);
        const validation = new Validator(validationObj, VALIDATION_RULES.ADMIN);

        if (validation.fails()) {
            throw new Error("Validation failed", validation.errors.all());
        }

        const result = await Admin.create({
            id: id,
            name: name,
            email: email,
            password: hashedPassword,
            createdAt: createdAt,
            createdBy: id,
            isActive: true,
            isDeleted: false
        });

        if (!result) {
            throw new Error("Unable to create admin");
        }
    } catch (error) {
        throw new Error(error);
    }
};