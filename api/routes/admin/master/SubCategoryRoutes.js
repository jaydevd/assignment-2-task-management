/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isAdminAuthenticated = require('./../../../middlewares/isAdminAuthenticated.js');
const { AddSubCategory, DeleteSubCategory, GetSubCategories } = require('./../../../controllers/admin/master/SubCategoryController.js');

const router = express.Router();

router.route('/AddSubCategory')
    .all(isAdminAuthenticated)
    .post(AddSubCategory);

router.route('/DeleteSubCategory')
    .all(isAdminAuthenticated)
    .post(DeleteSubCategory);

router.route('/GetSubCategories')
    .get(GetSubCategories);

module.exports = { SubCategoryRoutes: router };
