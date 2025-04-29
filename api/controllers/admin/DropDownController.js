/**
 * @name Dropdowns
 * @file DropdownController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will contain  all the dropdown methods.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { HTTP_STATUS_CODES } = require('../../config/constants');
const { sequelize } = require('./../../config/database');

const GetUsers = async (req, res) => {
    try {

        const query = `SELECT id, name FROM users;`;
        const [users, metadata] = await sequelize.query(query);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: users,
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
    GetUsers
}