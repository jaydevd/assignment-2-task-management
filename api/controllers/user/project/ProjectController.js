/**
 * @name ProjectController
 * @file ProjectController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain project methods
 * @author Jaydev Dwivedi (Zignuts)
 */

const { HTTP_STATUS_CODES } = require('./../../../config/constants');
const { sequelize } = require('./../../../config/database');

const ListProjects = async (req, res) => {
    try {
        const user = req.user;
        const id = user.id;

        const { name, page, limit } = req.query;
        const offset = Number(page - 1) * limit;

        let selectClauseCount = `SELECT COUNT(p.id)`;
        let selectClause = `SELECT p.id, p.name`;
        const fromClause = `\n FROM projects p JOIN project_members pm ON p.id = pm.project_id`;
        const groupByClause = `\n GROUP BY p.id`
        let whereClause = `\n WHERE p.is_active = true AND pm.is_active = true AND pm.user_id = '${id}'`;
        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset} `;

        if (name) whereClause = whereClause.concat(`\n AND p.name = '${name}'`);

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(groupByClause)
            .concat(paginationClause);

        selectClauseCount = selectClauseCount
            .concat(fromClause)
            .concat(whereClause)
            .concat(groupByClause);

        const [projects, metadata] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectClauseCount);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { projects, total },
            error: ''
        })

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
    ListProjects
}