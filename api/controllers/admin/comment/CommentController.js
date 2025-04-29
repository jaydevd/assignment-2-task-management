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
        const skip = Number(page - 1) * limit;

        const SELECT_COUNT = `SELECT COUNT(id) FROM comments`;
        const query = `
        SELECT id, comment, user_id, task_id FROM comments
        WHERE taskId = '${taskId}'
        `;
        const WHERE = ` AND comment = '%${comment}%'`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;
        const [total] = sequelize.query(SELECT_COUNT);

        if (comment) query += WHERE;
        query += LIMIT;

        const [comments, metadata] = await sequelize.query(query);

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

        const [result, metadata] = Comment.create({ id, taskId, comment, userId, createdAt, createdBy, isActive: true, isDeleted: false });

        if (!result) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: '',
                data: '',
                error: ''
            })
        }

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
            message: '',
            data: '',
            error: error.message
        });
    }
}

const DeleteComment = async (req, res) => {
    try {
        const { id } = req.body;

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
            message: '',
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