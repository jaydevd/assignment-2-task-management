/**
 * @name ProjectController
 * @file ProjectController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain project methods
 * @author Jaydev Dwivedi (Zignuts)
 */

const Validator = require("validatorjs");
const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');

const ListProjects = async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;

        const { search, page, limit } = req.query;

        const skip = Number(page - 1) * limit;

        const validationObj = { id };
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.USER.id
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }
        const query = `SELECT p.id, p.name FROM projects p
        JOIN project_members pm
        ON p.id = pm.project_id
        WHERE pm.id = '${id}'
        `;

        const WHERE = ` AND p.name ILIKE '%${search}`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;

        if (search) query += WHERE;
        query += LIMIT;

        const [projects, metadata] = await sequelize.query(query);

        if (!projects) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'tasks not found',
                data: '',
                error: ''
            })
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: projects,
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

module.exports = {
    ListProjects
}