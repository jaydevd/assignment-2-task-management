/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const router = express.Router();
const isAdminAuthenticated = require('./../../../middlewares/isAdminAuthenticated');
const { AdminLogIn, AdminLogOut } = require('./../../../controllers/admin/authentication/AdminAuthController');

router.post('/login', AdminLogIn);

router.route('/logout')
    .all(isAdminAuthenticated)
    .post(AdminLogOut);

module.exports = { AdminAuthRoutes: router }; 