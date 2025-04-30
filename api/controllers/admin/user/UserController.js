/**
 * @name signup/login/logout
 * @file UserAuthController.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description UserSignUp method will create a new user, UserLogIn method will log in an existing user and UserLogOut method will log out the logged in user.
 * @author Jaydev Dwivedi (Zignuts)
 */

const Validator = require("validatorjs");
const { HTTP_STATUS_CODES } = require('../../../config/constants');
const { sequelize } = require('../../../config/database');
const { VALIDATION_RULES } = require('../../../config/validations');

const ListUsers = async (req, res) => {
    try {
        const { search, page, limit, gender } = req.query;

        let selectClauseCount = `SELECT count(id)`;
        let selectClause = `SELECT id, name, email, phone_number, address, position, is_active`;
        const fromClause = `\n FROM users`;
        let whereClause = ``;

        if (search) whereClause = whereClause.concat(`\n AND (name ILIKE '%${search}%' OR email ILIKE '%${search}%' OR phone_number ILIKE '%${search}%')`);
        if (gender) whereClause = whereClause.concat(`\n AND (gender ILIKE '%${gender}%'`);

        const offset = Number(page - 1) * limit;

        const paginationClause = `\n LIMIT ${limit} OFFSET ${offset}`;

        selectClause = selectClause
            .concat(fromClause)
            .concat(whereClause)
            .concat(paginationClause);

        selectClauseCount = selectClauseCount
            .concat(fromClause)
            .concat(whereClause)

        const [users] = await sequelize.query(selectClause);
        const [total] = await sequelize.query(selectClauseCount);

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: '',
            data: { users, total },
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

const UpdateUser = async (req, res) => {
    try {
        const { id, name, phoneNumber, position, address, gender, joinedAt } = req.body;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.USER.ID,
            name: VALIDATION_RULES.USER.NAME,
            position: VALIDATION_RULES.USER.POSITION,
            address: VALIDATION_RULES.USER.ADDRESS,
            gender: VALIDATION_RULES.USER.GENDER,
            joinedAt: VALIDATION_RULES.USER.JOINED_AT
        });

        const JOINED_AT = +Date.parse(joinedAt);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'Validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        await User.update({ name, phoneNumber, position, address, gender, joinedAt: JOINED_AT }, { where: { id } });

        return res.status(200).json({
            status: HTTP_STATUS_CODES.SUCCESS.OK,
            message: 'user updated',
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

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.body;
        const admin = req.admin;
        const updatedBy = admin.id;

        const validationObj = req.body;
        const validation = new Validator(validationObj, {
            id: VALIDATION_RULES.USER.ID
        })

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const updatedAt = Math.floor(Date.now() / 1000);

        await User.update({ isActive: false, isDeleted: true, updatedAt, updatedBy }, { where: { id } });

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
        })
    }
}

module.exports = {
    ListUsers,
    UpdateUser,
    DeleteUser
}