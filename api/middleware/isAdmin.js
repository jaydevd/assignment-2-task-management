const jwt = require('jsonwebtoken');
const { Admin } = require('../models/index.js');
const { HTTP_STATUS_CODES } = require('../config/constants.js');
const { sequelize } = require('../config/database.js');

const isAdmin = async (req, res, next) => {

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token from isAdmin: ", token);

    if (!token) {
      return res.status(400).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
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
    SELECT id, token, is_active FROM admins WHERE id = ${payload.id}
    `;

    const [admins, metadata] = sequelize.query(query);

    if (admins.length() == 0) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
        message: 'No user found',
        data: '',
        error: ''
      });
    }

    const admin = admin[0];

    if (!admin.is_active) {
      console.log("admin active? ", admin.is_active);
      return res.status(403).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
        message: 'Admin is not active',
        data: '',
        error: ''
      });
    }

    if (token !== admin.token) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
        message: "Tokens don't match",
        data: '',
        error: ''
      });
    }

    req.admin = admin;
    next();

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

module.exports = { isAdmin };