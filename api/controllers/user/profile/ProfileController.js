/**
 * @name ProjectController
 * @file ProjectController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain all the methods of project.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { User } = require('./../../../models/index');
const Validator = require('validatorjs');
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { VALIDATION_RULES } = require('../../../config/validations');
const { sequelize } = require('../../../config/database');

const UpdateProfile = async (req, res) => {

    try {
        const user = req.user;
        const id = user.id;
        const { name, phoneNumber, gender, joinedAt, address } = req.body;

        const validationObj = req.body;
        let validation = new Validator(validationObj, {
            name: VALIDATION_RULES.USER.NAME,
            poneNumber: VALIDATION_RULES.USER.PHONE_NUMBER,
            gender: VALIDATION_RULES.USER.GENDER,
            address: VALIDATION_RULES.USER.ADDRESS
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                data: '',
                message: 'validation failed',
                error: validation.errors.all()
            })
        }

        const updatedAt = new Date(Math.floor(Date.now() / 1000));

        const query = `
        UPDATE users
        SET 
        `;
        const NAME = `name = '${name}'`;
        const PHONE_NUMBER = `,phone_number = '${phoneNumber}'`;
        const ADDRESS = `,address = '${address}'`;
        const GENDER = `,gender = '${gender}'`;
        const JOINED_AT = `,joined_at = '${joinedAt}'`;
        const UPDATED = `, updated_at = '${updatedAt}', updated_by = '${id}'`;
        const WHERE = ` WHERE id = '${id}'`;

        if (name) query += NAME;
        if (phoneNumber) query += PHONE_NUMBER;
        if (address) query += ADDRESS;
        if (gender) query += GENDER;
        if (joinedAt) query += JOINED_AT;

        query = query + UPDATED + WHERE;

        await sequelize.query(query);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            data: result.id,
            message: 'Data Created Successfully',
            error: ''
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            data: '',
            message: '',
            error: error.message
        })
    }
}

module.exports = { UpdateProfile }