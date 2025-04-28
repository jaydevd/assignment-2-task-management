const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { ProfileRoutes } = require('./profile/ProfileRoutes.js');
const { TaskRoutes } = require('./task/TaskRoutes.js');
const { ProjectRoutes } = require('./project/ProjectRoutes.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/profile', ProfileRoutes);
router.use('/task', TaskRoutes);
router.use('/project', ProjectRoutes);

module.exports = { UserRoutes: router };