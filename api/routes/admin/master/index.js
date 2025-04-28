const express = require('express');

const { TaskRoutes } = require('./TaskRoutes');
const { UsersRoutes } = require('./UsersRoutes');
const { ProjectRoutes } = require('./ProjectRoutes');

const router = express.Router();

router.use('/task', TaskRoutes);
router.use('/project', ProjectRoutes);
router.use('/users', UsersRoutes);

module.exports = { MasterRoutes: router };