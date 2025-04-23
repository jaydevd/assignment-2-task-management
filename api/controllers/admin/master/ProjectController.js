/**
 * @name ProjectController
 * @file ProjectController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain Task management APIs.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Task, Project } = require('../../../models/index');
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { Sequelize, Op } = require('sequelize');
const { VALIDATION_RULES } = require('../../../config/validations');

const ListProjects = async (req, res) => {
    try {

        const projects = await Project.findAll({ attributes: ['id', 'name', 'members'] });

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

        const id = uuidv4();

        const query = `
        INSERT INTO projects (id, name, members, created_by, created_at, is_active, is_deleted)
        VALUES
            ('${id}', '${name}', '{${members}}', '${adminID}', '${new Date()}', true, false)
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
        const adminID = admin.id;

        const result = await Project.update({ name, members, updatedAt: new Date(), updatedBy: adminID }, { where: { id: id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'project not updated',
                data: '',
                error: ''
            })
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
        const adminID = admin.id;

        const result = await Project.update({ isActive: false, isDeleted: true, updatedAt: new Date(), updatedBy: adminID }, { where: { id: id } });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'project not deleted',
                data: '',
                error: ''
            })
        }

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

module.exports = { ListProjects, CreateProject, UpdateProject, DeleteProject }