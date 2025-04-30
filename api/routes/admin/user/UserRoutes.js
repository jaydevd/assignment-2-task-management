const express = require('express');
const { isAdmin } = require('../../../middleware/isAdmin');
const { ListUsers, UpdateUser, DeleteUser } = require('../../../controllers/admin/user/UserController');

const router = express.Router();

router.route('/list')
    .all(isAdmin)
    .get(ListUsers);

router.route('/update')
    .all(isAdmin)
    .post(UpdateUser);

router.route('/delete')
    .all(isAdmin)
    .get(DeleteUser);

module.exports = { UserRoutes: router };