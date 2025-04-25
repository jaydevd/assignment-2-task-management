/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { isAdmin } = require('../../../middleware/isAdmin');
const { ListUsers, UpdateUser, DeleteUser } = require('./../../../controllers/admin/master/UsersController');
const { cache } = require('../../../middleware/cache');

const router = express.Router();

router.route('/list')
    .all(cache, isAdmin)
    .get(ListUsers);

router.route('/update-user')
    .all(isAdmin)
    .post(UpdateUser);

router.route('/delete-user')
    .all(isAdmin)
    .get(DeleteUser);

module.exports = { UsersRoutes: router };