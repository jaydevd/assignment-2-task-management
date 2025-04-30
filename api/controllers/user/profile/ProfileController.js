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
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = new Date(Math.floor(Date.now() / 1000));
        const JOINED_AT = Math.floor(+Date.parse(joinedAt) / 1000);

        await User.update({ name, phoneNumber, address, gender, joinedAt: JOINED_AT, updatedAt, updatedBy: id }, { where: { id, isActive: true } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'Data saved Successfully',
            data: result.id,
            error: ''
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
        })
    }
}

module.exports = { UpdateProfile }