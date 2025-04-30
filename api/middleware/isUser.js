const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../config/constants.js');
const { User } = require('../models/User.js');

const isUser = async (req, res, next) => {

    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: 'Token not found',
                data: '',
                error: ''
            })
        }

        // Verify JWT
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        if (!payload) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: 'Invalid Token',
                data: '',
                error: ''
            })
        }

        const user = await User.findOne({ attributes: ['id', 'token', 'isActive'], where: { id: payload.id } });

        if (!user.isActive) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: 'User not active',
                data: '',
                error: ''
            });
        }

        if (token !== user.token) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: "Tokens don't match",
                data: '',
                error: ''
            });
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            status: HTTP_STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
            message: 'internal server error',
            data: '',
            error: error.message
            ,
        });
    }
}

module.exports = { isUser };