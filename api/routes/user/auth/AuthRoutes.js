/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { LogIn, LogOut, SignUp } = require('../../../controllers/user/auth/AuthController');
const isUser = require('../../../middlewares/isUser');

const router = express.Router();

router.route('/signup')
    .post(SignUp);

router.route('/login')
    .post(LogIn);

router.route('/logout')
    .all(isUser)
    .post(LogOut);

module.exports = { AuthRoutes: router };