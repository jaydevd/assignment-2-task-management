/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { ProfileRoutes } = require('./profile/ProfileRoutes.js');
const { TaskRoutes } = require('./task/TaskRoutes.js');
const { DropDownRoutes } = require('./dropDown/DropDownRoutes.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/profile', ProfileRoutes);
router.use('/task', TaskRoutes);
router.use('/drop-down', DropDownRoutes);

module.exports = { UserRoutes: router };