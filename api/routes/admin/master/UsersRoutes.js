/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isAdmin = require('../../../middlewares/isAdmin.js');
const { ListUsers, EditUser, DeleteUser } = require('./../../../controllers/admin/master/UsersController.js');

const router = express.Router();

router.route('/list-users')
    .all(isAdmin)
    .get(ListUsers);

router.route('/update-user')
    .all(isAdmin)
    .post(EditUser);

router.route('/delete-user')
    .all(isAdmin)
    .get(DeleteUser);

module.exports = { UsersRoutes: router };