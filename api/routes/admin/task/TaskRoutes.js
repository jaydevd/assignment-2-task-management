const express = require('express');
const {
    AssignTask,
    UpdateTask,
    DeleteTask,
    ListTasks
} = require('../../../controllers/admin/task/TaskController');
const { isAdmin } = require('../../../middleware/isAdmin');

const router = express.Router();

router.route('/list')
    .all(isAdmin)
    .get(ListTasks);

router.route('/assign')
    .all(isAdmin)
    .post(AssignTask);

router.route('/update')
    .all(isAdmin)
    .post(UpdateTask);

router.route('/delete')
    .all(isAdmin)
    .post(DeleteTask);

module.exports = { TaskRoutes: router };