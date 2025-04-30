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
const { Op } = require('sequelize');

const ListProjects = async (req, res) => {
    try {
        const { page, name, limit } = req.query;
        const offset = Number(page - 1) * limit;

        let selectClauseCount = `SELECT COUNT(p.id)`;
        let selectClause = `SELECT p.id, p.name, COUNT(pm.id) as total_members, p.is_active, p.is_deleted`;
        const fromClause = `\n FROM projects p JOIN project_members pm ON p.id = pm.project_id`;
        const groupByClause = `\n GROUP BY p.id, pm.id`
        let whereClause = ``;
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset} `;

        if (name) whereClause = whereClause.concat(`\n WHERE p.name = '${name}'`);

        selectClause = selectClause
            .concat(fromClause)
            .concat(groupByClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectClauseCount = selectClauseCount
            .concat(fromClause)
            .concat(groupByClause)
            .concat(whereClause);

        const [projects, metadata] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectClauseCount);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { projects, total },
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
        const offset = Number(page - 1) * limit;

        let selectClauseCount = `SELECT COUNT(p.id)`;
        let selectClause = `SELECT p.id, u.name, p.role, u.email`;
        const fromClause = `\n FROM project_members p JOIN users u ON p.user_id = u.id`;
        let whereClause = `\n WHERE project_id = '${projectId}'`;
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset} `;

        if (search) whereClause = whereClause.concat(`\n WHERE name ILIKE '%${search}%'`);

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectClauseCount = selectClauseCount
            .concat(fromClause)
            .concat(whereClause);

        const [members, metadata] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectClauseCount);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { members, total },
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
        const createdBy = admin.id;
        const createdAt = Math.floor(Date.now() / 1000);

        const validationObj = { name };
        const validation = new Validator(validationObj, {
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
        const id = uuidv4();

        await Project.create({ id, name, createdBy, createdAt, isActive: true, isDeleted: false });

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
        const createdBy = admin.id;
        const createdAt = Math.floor(Date.now() / 1000);

        await ProjectMember.create({ id, userId, projectId, role, createdBy, createdAt, isActive: true, isDeleted: false });

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
        const { id, name, members } = req.body;
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

        if (members) {
            await ProjectMember.update({ projectId: id }, { where: { id: { [Op.in]: members } } });
        }

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
        await ProjectMember.update({ isActive: false, isDeleted: true }, { where: { projectId: id } });

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