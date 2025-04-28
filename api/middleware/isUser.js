const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CODES } = require('../config/constants.js');
const { sequelize } = require('../config/database.js');

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

        const query = `
        SELECT id, token, is_active FROM users WHERE id = ${payload.id}
        `;

        const [users, metadata] = sequelize.query(query);

        if (users.length() == 0) {
            return res.status(401).json({
                status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
                message: 'No user found',
                data: '',
                error: ''
            });
        }

        const user = users[0];

        if (!user.is_active) {
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
            message: '',
            data: '',
            error: error.message
            ,
        });
    }
}

module.exports = { isUser };