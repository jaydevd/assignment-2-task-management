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

const ListProjects = async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;

        const { search, page, limit } = req.query;

        const skip = Number(page - 1) * limit;

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