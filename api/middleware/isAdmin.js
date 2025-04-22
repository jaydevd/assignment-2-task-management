/**
 * @name AdminAuthentication
 * @file isAdmin.js
 * @param {Request} req
 * @param {Response} res
 * @param {next} next
 * @throwsF
 * @description This file will check if the admin is authenticated or not.
 * @author Jaydev Dwivedi (Zignuts)
 */

const jwt = require('jsonwebtoken');
const { Admin } = require('../models/index.js');
const { HTTP_STATUS_CODES } = require('../config/constants.js');

const isAdmin = async (req, res, next) => {

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token from isAdminAuthenticated: ", token);

    if (!token) {
      return res.status(400).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
        message: '',
        data: '',
        error: 'Token not found'
      })
    }

    // Verify JWT
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (!payload) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
        message: '',
        error: 'Invalid Token',
        data: ''
      })
    }

    const admin = await Admin.findOne({
      attributes: ['id', 'name', 'email', 'token', 'isActive'],
      where: { id: payload.id }
    });

    console.log(admin);

    if (!admin.id) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
        message: '',
        error: 'No user found',
        data: ''
      });
    }

    if (!admin.isActive) {
      console.log("admin active? ", admin.isActive);
      return res.status(403).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.FORBIDDEN,
        message: '',
        error: 'Admin is not active',
        data: ''
      });
    }

    if (token !== admin.token) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED,
        message: '',
        data: '',
        error: "Tokens don't match"
      });
    }

    req.admin = admin;
    next();

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

module.exports = { isAdmin };