/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { TaskRoutes } = require('./TaskRoutes');
const { UsersRoutes } = require('./UsersRoutes');
const { ProjectRoutes } = require('./ProjectRoutes');

const router = express.Router();

router.use('/task', TaskRoutes);
router.use('/project', ProjectRoutes);
router.use('/users', UsersRoutes);

module.exports = { MasterRoutes: router };