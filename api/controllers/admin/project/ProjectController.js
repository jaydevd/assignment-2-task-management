/**
 * @name ProjectController
 * @file ProjectController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain Project management methods.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require('../../../config/redis');

const ListProjects = async (req, res) => {
    try {
        const { page, name, limit } = req.query;
        const skip = Number(page - 1) * limit;

        let query = `SELECT id, name, members FROM projects`;
        const WHERE = ` WHERE name ILIKE '%${name}%'`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;

        if (name) {
            query += WHERE;
        }

        query += LIMIT;
        const projects = await sequelize.query(query);

        if (!projects) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'no projects found',
                data: '',
                error: ''
            });
        }

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'projects found',
            data: projects,
            error: ''
        });

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

const CreateProject = async (req, res) => {
    try {

        const { name, members } = req.body;
        const admin = req.admin;
        const adminID = admin.id;
        const createdAt = Math.floor(Date.now() / 1000);

        const validationObj = { name, members };
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.PROJECT.NAME,
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }
        const id = uuidv4();

        const query = `
        INSERT INTO projects (id, name, created_by, created_at, is_active, is_deleted)
        VALUES
            ('${id}', '${name}', '${adminID}', '${createdAt}', true, false)
        ;`;

        await sequelize.query(query);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'project saved',
            data: '',
            error: ''
        });

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

const UpdateProject = async (req, res) => {
    try {
        const { id, name } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = { id, name };
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.PROJECT.ID,
            name: VALIDATION_RULES.PROJECT.NAME
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = Math.floor(Date.now() / 1000);

        await sequelize.query(`UPDATE projects SET name = '${name}', updated_at = '${updatedAt}', updated_by = '${updatedBy}' WHERE id = '${id}'`);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'project updated',
            data: '',
            error: ''
        });

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

const DeleteProject = async (req, res) => {
    try {
        const { id } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = { id };
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.PROJECT.ID
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validaiton failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = Math.floor(Date.now() / 1000);

        await sequelize.query(`UPDATE projects SET updated_at = '${updatedAt}', updated_by = '${updatedBy}', is_active = false, is_deleted = true`);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'project deleted',
            data: '',
            error: ''
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
        })
    }
}

module.exports = {
    ListProjects,
    CreateProject,
    UpdateProject,
    DeleteProject
}