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

router.post('/sign-up', SignUp);
router.post('/log-in', LogIn);

router.route('/log-out')
    .all(isUser)
    .post(LogOut);

module.exports = { AuthRoutes: router };