/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const {
    AssignTask,
    UpdateTask,
    Comment,
    DeleteTask,
    ListTasks
} = require('./../../../controllers/admin/task/TaskController');
const { isAdmin } = require('./../../../middleware/isAdmin');

const router = express.Router();

router.route('/list')
    .all(isAdmin)
    .post(ListTasks);

router.route('/assign')
    .all(isAdmin)
    .post(AssignTask);

router.route('/comment')
    .all(isAdmin)
    .post(Comment);

router.route('/update')
    .all(isAdmin)
    .post(UpdateTask);

router.route('/delete')
    .all(isAdmin)
    .post(DeleteTask);

module.exports = { TaskRoutes: router };