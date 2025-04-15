/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { AddCategory, DeleteCategory, AddSubCategory, ListCategories } = require('./../../../controllers/admin/master/CategoryController.js');
const isAdmin = require('../../../middlewares/isAdmin.js');

const router = express.Router();

router.route('/add')
    .all(isAdmin)
    .post(AddCategory);

router.route('/add-sub-category')
    .all(isAdmin)
    .post(AddSubCategory);

router.route('/list-categories')
    .all(isAdmin)
    .get(ListCategories);

router.route('/delete')
    .all(isAdmin)
    .post(DeleteCategory);

module.exports = { CategoryRoutes: router }; 
