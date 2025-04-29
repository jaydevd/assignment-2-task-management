const express = require('express');
const { ListTasks, UpdateTask, Comment } = require('./../../../controllers/user/task/TaskController');
const { isUser } = require('./../../../middleware/isUser');
const router = express.Router();

router.route('/list')
    .all(isUser)
    .get(ListTasks);

router.route('/update')
    .all(isUser)
    .post(UpdateTask);

module.exports = { TaskRoutes: router };