/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { UserLogIn, UserLogOut, UserSignUp } = require('./../../../controllers/user/authentication/UserAuthController');
const isUserAuthenticated = require('./../../../middlewares/isUserAuthenticated');

const router = express.Router();

router.post('/signup', UserSignUp);
router.post('/login', UserLogIn);

router.route('/logout')
    .all(isUserAuthenticated)
    .post(UserLogOut);

module.exports = { UserAuthRoutes: router };