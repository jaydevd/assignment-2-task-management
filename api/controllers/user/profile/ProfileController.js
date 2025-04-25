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
        const { id, name } = req.body;

        const validationObj = req.body;
        let validation = new Validator(validationObj, {
            id: VALIDATION_RULES.USER.id,
            name: VALIDATION_RULES.USER.name
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                data: '',
                message: 'validation failed',
                error: validation.errors.all()
            })
        }

        const verifyID = await User.findOne({ attributes: ['id'], where: { id: id } });

        if (!verifyID) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'id not found',
                data: '',
                error: ''
            })
        }

        const result = await User.update({
            name,
            updatedAt: new Date(Math.floor(Date.now() / 1000)),
            updatedBy: id
        }, { where: { id: id } });

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

const DeleteProfile = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }

        const user = await User.findOne({ attributes: ['id'], where: { id: id } });

        if (!user) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }

        const result = await User.update({ isActive: false, isDeleted: true }, { where: { id: id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'unable to delete user',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'user deleted',
            data: '',
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

module.exports = { UpdateProfile, DeleteProfile }