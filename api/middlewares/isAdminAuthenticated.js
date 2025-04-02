/**
 * @name userAuthentication
 * @file isAdminAuthenticated.js
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

const isAdminAuthenticated = async (req, res, next) => {

  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("token from isAdminAuthenticated: ", token);

    if (!token) {
      return res.status(400).json({
        status: HTTP_STATUS_CODES.CLIENT_ERROR,
        message: '',
        data: '',
        error: 'Token not found'
      })
    }

    // Verify JWT
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    if (!payload) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: '',
        error: 'Invalid Token',
        data: ''
      })
    }

    const admin = await Admin.findOne({
      attributes: ['id', 'name', 'email', 'token', 'is_active'],
      where: { id: payload.id }
    });


    if (!admin.id) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: '',
        error: 'No user found',
        data: ''
      });
    }

    if (!admin.is_active) {
      return res.status(400).json({
        status: '400',
        message: '',
        error: 'Admin is not active',
        data: ''
      });
    }

    if (token !== admin.token) {
      return res.status(401).json({
        status: HTTP_STATUS_CODES.UNAUTHORIZED,
        message: '',
        data: '',
        error: "Tokens don't match"
      });
    }

    req.body.admin = admin;
    next();

  } catch (error) {

    console.log(error);
    return res.status(500).json({
      status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: '',
      data: '',
      error: error.message
    });
  }
}

module.exports = isAdminAuthenticated;