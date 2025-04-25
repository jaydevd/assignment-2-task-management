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
const client = require('../../../config/redis');

const ListProjects = async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;
        console.log(user, id);
        const { query, page } = req.query;

        const limit = 2;
        const skip = Number(page - 1) * limit;

        const start = skip;
        const end = start + limit - 1;

        const cachedProjects = await client.zRange('projects', start, end);

        if (cachedProjects) {

            let projects = await Promise.all(
                ids.map(id => client.hGetAll(id))
            );

            if (query) {
                projects = projects.filter(project => project.name == query);
            }
            return res.status(200).json({
                status: HTTP_STATUS_CODES.SUCCESS.OK,
                message: '',
                data: projects,
                error: ''
            })
        }

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

        const rawQuery = `
        SELECT p.id, p.name
        FROM projects p
        WHERE '${id}' = ANY(p.members) AND p.name ILIKE '%${query || ''}%'
        LIMIT ${limit || 10} OFFSET ${skip || 0}
        `;

        const [projects, metadata] = await sequelize.query(rawQuery);

        if (!projects) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'tasks not found',
                data: '',
                error: ''
            })
        }

        await Promise.all(
            projects.map(project =>
                client.hSet(`project:${project.id}`, project)
            )
        );

        await client.zAdd('projects', projects.map(project => ({
            score: project.id,
            value: `user:${project.id}`,
        })));

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