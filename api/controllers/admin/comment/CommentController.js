/**
 * @name TaskController
 * @file TaskController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain Task management methods.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { v4: uuidv4 } = require('uuid');
const Validator = require("validatorjs");
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');
const { Comment } = require('../../../models');

const ListComments = async (req, res) => {
    try {
        const { taskId, comment, page, limit } = req.query;
        const offset = Number(page - 1) * limit;

        let selectClauseCount = `SELECT COUNT(id)`;
        let selectClause = `SELECT id, comment, user_id, task_id, is_active, is_deleted`;
        const fromClause = `\n FROM comments`;
        let whereClause = `\n WHERE task_id = '${taskId}'`;
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        if (comment) whereClause.concat(`\n AND comment = '${comment}'`);

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectClauseCount = selectClauseCount
            .concat(fromClause)
            .concat(whereClause);

        const [comments, metadata] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectClauseCount);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { total, comments },
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

const AddComment = async (req, res) => {
    try {

        const { taskId, comment, userId } = req.body;
        const id = uuidv4();
        const admin = req.admin;
        const createdBy = admin.id;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            taskId: VALIDATION_RULES.COMMENT.TASK_ID,
            comment: VALIDATION_RULES.COMMENT.COMMENT,
            userId: VALIDATION_RULES.COMMENT.USER_ID
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const createdAt = Math.floor(Date.now() / 1000);

        await Comment.create({ id, taskId, comment, userId, createdAt, createdBy, isActive: true, isDeleted: false });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'comment saved',
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
        });
    }
}

const DeleteComment = async (req, res) => {
    try {
        const { id } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = req.body;

        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.COMMENT.ID
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        await Comment.update({ isActive: false, isDeleted: true, updatedAt, updatedBy }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'comment deleted',
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
    ListComments,
    AddComment,
    DeleteComment
}