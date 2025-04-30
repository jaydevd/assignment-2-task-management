/**
 * @name TaskController
 * @file TaskController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain methods for Tasks.
 * @author Jaydev Dwivedi (Zignuts)
 */

const Validator = require("validatorjs");
const { Task } = require('./../../../models/index');
const { HTTP_STATUS_CODES, STATUS } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');

const ListTasks = async (req, res) => {
    try {
        const user = req.user;

        const { title, page, userId, status, limit, projectId } = req.query;

        const validationObj = req.query;
        const validation = new Validator(validationObj, {
            title: VALIDATION_RULES.TASK.TITLE,
            dueDate: VALIDATION_RULES.TASK.DUE_DATE,
            projectId: VALIDATION_RULES.TASK.PROJECT_ID,
            userId: VALIDATION_RULES.TASK.USER_ID,
            STATUS: VALIDATION_RULES.TASK.STATUS
        });

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        let dueDateISO = new Date();
        dueDateISO = dueDateISO.toISOString().slice(0, 10);
        const dueDate = Math.floor(+Date.parse(dueDateISO) / 1000);

        let selectClauseCount = `SELECT count(id)`;
        let selectClause = `SELECT t.id, t.title, t.status, t.due_date`;
        const fromClause = `\n FROM tasks t`;

        let whereClause = `\n WHERE
                t.is_active = true
                AND project_id = '${projectId}'
                AND t.user_id = '${userId}'
                AND t.due_date >= '${dueDate}'`
            ;

        if (title) whereClause = whereClause.concat(`\n AND t.title ILIKE '%${title}%'`);
        if (status) whereClause = whereClause.concat(`\n AND t.status = '${status}'`);

        const offset = Number(page - 1) * limit;

        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectClauseCount = selectClauseCount
            .concat(fromClause)
            .concat(whereClause)

        const [tasks, metadata] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectClauseCount);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { tasks, total },
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

// user can change status of the task
const UpdateTask = async (req, res) => {
    try {

        const { id, status } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            status: VALIDATION_RULES.TASK.STATUS,
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

        await Task.update({ status, updatedAt, updatedBy: id }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'task updated',
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

module.exports = {
    ListTasks,
    UpdateTask
}