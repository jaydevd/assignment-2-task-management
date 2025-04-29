const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { DropDownRoutes } = require('./dropDown/DropDownRoutes.js');
const { CommentRoutes } = require('./comment/CommentRoutes.js');
const { UserRoutes } = require('./user/UserRoutes.js');
const { ProjectRoutes } = require('./project/ProjectRoutes.js');
const { TaskRoutes } = require('./task/TaskRoutes.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/comment', CommentRoutes);
router.use('/manage-user', UserRoutes);
router.use('/project', ProjectRoutes);
router.use('/task', TaskRoutes);
router.use('/drop-down', DropDownRoutes);

module.exports = { AdminRoutes: router };