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
const { Project, ProjectMember } = require('../../../models');

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

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
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

const ListMembers = async (req, res) => {
    try {
        const { search, projectId, limit, page } = req.query;
        const skip = Number(page - 1) * limit;

        const query = `
        SELECT pm.id, u.name, u.email, pm.role FROM project_members pm
        JOIN users u
        ON pm.user_id = u.id
        WHERE pm.project_id = '${projectId}'
        AND pm.is_active = true
        `;

        const WHERE = ` AND u.name ILIKE '${search}' OR u.email ILIKE '${search}'`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;

        if (search) query += WHERE
        query += LIMIT;

        const [members, metadata] = await sequelize.query(query);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: members,
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

        const { name } = req.body;
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

        await Project.create({ id, name, createdBy: adminID, createdAt, isActive: true, isDeleted: false });

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

const AddMember = async (req, res) => {
    try {
        const { userId, projectId, role } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            userId: VALIDATION_RULES.PROJECT_MEMBERS.ID,
            projectId: VALIDATION_RULES.PROJECT_MEMBERS.PROJECT_ID,
            role: VALIDATION_RULES.PROJECT_MEMBERS.ROLE
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const id = uuidv4();
        const admin = req.admin;
        const adminId = admin.id;
        const createdAt = Math.floor(Date.now() / 1000);

        await ProjectMember.create({ id, userId, projectId, role, createdBy: adminId, createdAt, isActive: true, isDeleted: false });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
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
        });
    }
}

const DeleteMember = async (req, res) => {
    try {
        const { id } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = { id };
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.PROJECT_MEMBERS.ID
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

        await ProjectMember.update({ isActive: false, isDeleted: true, updatedAt, updatedBy }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'member deleted',
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

        await Project.update({ name, updatedAt, updatedBy }, { where: { id } });

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

        await Project.update({ isActive: false, isDeleted: true, updatedAt, updatedBy }, { where: { id } });

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
    ListMembers,
    AddMember,
    DeleteMember,
    UpdateProject,
    DeleteProject
}