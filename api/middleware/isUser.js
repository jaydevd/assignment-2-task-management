/**
 * @name userAuthentication
 * @file isAuthenticated.js
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @throwsF
 * @description This file will check if the user is authenticated or not.
 * @author Jaydev Dwivedi (Zignuts)
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models/index.js');
const { HTTP_STATUS_CODES } = require('../config/constants.js');

const isUser = async (req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: '',
                data: '',
                error: 'Token not found'
            })
        }

        const payload = jwt.verify(token, process.env.SECRET_KEY);

        if (!payload) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: '',
                error: 'Invalid Token',
                data: ''
            })
        }

        const user = await User.findOne({
            where: { token: token, id: payload.id },
            attributes: ['id', 'name', 'email', 'token', 'isActive']
        });

        if (!user) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: '',
                error: 'User not found',
                data: ''
            });
        }



        if (!user.isActive) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: '',
                error: 'User not active',
                data: ''
            });
        }

        if (token !== user.token) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: '',
                data: '',
                error: "Tokens don't match"
            });
        }

        req.user = user;
        console.log("authentication done");
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: '',
            data: '',
            error: error.message
            ,
        });
    }
}

module.exports = { isUser };