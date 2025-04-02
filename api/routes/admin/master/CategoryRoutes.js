/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { AddCategory, DeleteCategory, GetCategories } = require('./../../../controllers/admin/master/CategoryController.js');
const isAdminAuthenticated = require('./../../../middlewares/isAdminAuthenticated.js');

const router = express.Router();

router.route('/AddCategory')
    .all(isAdminAuthenticated)
    .post(AddCategory);

router.route('/DeleteCategory')
    .all(isAdminAuthenticated)
    .post(DeleteCategory);

router.route('/GetCategories')
    .get(GetCategories);

module.exports = { CategoryRoutes: router }; 
