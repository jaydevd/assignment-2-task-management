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
        const { search, page, limit } = req.query;
        const skip = Number(page - 1) * limit;

        const query = `SELECT u.id, u.name, u.email FROM users u WHERE u.is_active = true`;
        const WHERE = ` (u.name ILIKE '%${search}%' OR u.email ILIKE '%${search}%')`;
        const LIMIT = ` LIMIT ${limit} OFFSET ${skip}`;

        if (search) query += WHERE;
        query += LIMIT;

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

        const joinedAtTP = +Date.parse(joinedAt);

        if (validation.fails()) {
            return res.status(400).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
                message: 'Validation failed',
                data: '',
                error: validation.errors.all()
            })
        }

        const query = `
        UPDATE users
        SET 
        `;
        const NAME = `name = '${name}'`;
        const PHONE_NUMBER = `,phone_number = '${phoneNumber}'`;
        const ADDRESS = `,address = '${address}'`;
        const GENDER = `,gender = '${gender}'`;
        const JOINED_AT = `,joined_at = '${joinedAtTP}'`;
        const POSITION = `,POSITION = '${position}`;
        const WHERE = ` WHERE id = '${id}'`;

        if (name) query += NAME;
        if (phoneNumber) query += PHONE_NUMBER;
        if (address) query += ADDRESS;
        if (gender) query += GENDER;
        if (joinedAt) query += JOINED_AT;
        if (position) query += POSITION;

        query += WHERE;

        await sequelize.query(query);

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

        const query = `
        UPDATE users
        SET
        updated_at = '${updatedAt}',
        updated_by = '${updatedBy}',
        is_active = false,
        is_deleted = true
        WHERE id = '${id}'
        `;

        await sequelize.query(query);

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