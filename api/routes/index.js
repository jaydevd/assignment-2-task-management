/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { AdminRoutes } = require('./admin/index');
const { UserRoutes } = require('./user/index');

const router = express.Router();

// user routes
router.use('/user', UserRoutes);
router.use('/admin', AdminRoutes);

module.exports = router;