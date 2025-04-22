/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../../middleware/isAdmin');
const { LogIn, LogOut } = require('../../../controllers/admin/auth/AuthController');

router.post('/login', LogIn);

router.route('/logout')
    .all(isAdmin)
    .post(LogOut);

module.exports = { AuthRoutes: router };