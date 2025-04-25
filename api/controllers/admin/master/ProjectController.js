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
const { Project } = require('../../../models');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');
const client = require('../../../config/redis');

const ListProjects = async (req, res) => {
    try {
        const { page, query } = req.query;
        const limit = 10;
        const skip = Number(page - 1) * limit;
        const end = skip + limit - 1;

        // console.log("waiting for projects to be fetched.");
        await client.del('projects');
        const cachedProjects = await client.zRange('projects', skip, end);
        console.log(typeof cachedProjects);

        if (Object.keys(cachedProjects).length != 0) {
            console.log("projects found!");
            let projects = await Promise.all(
                cachedProjects.map(project => client.hGetAll(project.id))
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
        console.log("No cached projects");

        const projects = await Project.findAll({ attributes: ['id', 'name', 'members'] }, { limit: limit, offset: skip });

        if (!projects) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'no projects found',
                data: '',
                error: ''
            });
        }

        await Promise.all(
            projects.map(project => {
                return client.hSet(`project:${project.id}`, {
                    id: String(project.id),
                    name: project.name,
                    members: project.members.toString()
                });
            })
        );


        await client.zAdd('projects', projects.map(project => ({
            score: Number(project.createdAt || Date.now()),
            value: `project:${project.id}`
        })));

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

const CreateProject = async (req, res) => {
    try {

        const { name, members } = req.body;
        const admin = req.admin;
        const adminID = admin.id;
        const formattedMembers = `'{${members.map(m => `"${m}"`).join(',')}}'`;
        const date = new Date(Math.floor(Date.now() / 1000 * 1000)).toISOString();

        const validationObj = { name, members };
        const validation = new Validator(validationObj, {
            name: VALIDATION_RULES.PROJECT.name,
            members: VALIDATION_RULES.PROJECT.members
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
        INSERT INTO projects (id, name, members, created_by, created_at, is_active, is_deleted)
        VALUES
            ('${id}', '${name}', ${formattedMembers}, '${adminID}', '${date}', true, false)
        ;
    `;

        const [result, metadata] = await sequelize.query(query);

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'project not saved',
                data: '',
                error: ''
            })
        }

        await client.zAdd('projects', {
            score: id,
            value: `project:${id}`,
        });

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
        const { id, name, members } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = { id, name, members };
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.PROJECT.id,
            name: VALIDATION_RULES.PROJECT.name,
            members: VALIDATION_RULES.PROJECT.members
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = new Date(Math.floor(Date.now() / 1000 * 1000)).toISOString();

        const result = await Project.update({ name, members, updatedAt, updatedBy }, { where: { id } });


        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'project not updated',
                data: '',
                error: ''
            })
        }

        await client.zRem('projects', `project:${id}`);
        await client.zAdd('projects', {
            score: id,
            value: `project:${id}`
        });

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
            id: VALIDATION_RULES.ADMIN.id
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validaiton failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = new Date(Math.floor(Date.now() / 1000 * 1000)).toISOString();

        const result = await Project.update({ isActive: false, isDeleted: true, updatedAt, updatedBy }, { where: { id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'project not deleted',
                data: '',
                error: ''
            })
        }

        await client.zRem('projects', `project:${id}`);

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