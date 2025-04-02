/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isAdminAuthenticated = require('./../../../middlewares/isAdminAuthenticated.js');
const { ListUsers, EditUser, DeleteUser } = require('./../../../controllers/admin/master/UsersController.js');

const router = express.Router();

router.route('/ListUsers')
    .all(isAdminAuthenticated)
    .post(ListUsers);

router.route('/EditUsers')
    .all(isAdminAuthenticated)
    .post(EditUser);

router.route('/DeleteUsers')
    .get(DeleteUser);

module.exports = { SubCategoryRoutes: router };
