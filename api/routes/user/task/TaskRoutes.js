/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { GetTasks, UpdateTask, Comment } = require('./../../../controllers/user/task/TaskController');
const { isUser } = require('./../../../middleware/isUser');
const router = express.Router();

router.route('/tasks')
    .all(isUser)
    .post(GetTasks);

router.route('/comment')
    .all(isUser)
    .post(Comment);

router.route('/update')
    .all(isUser)
    .post(UpdateTask);

module.exports = { TaskRoutes: router };