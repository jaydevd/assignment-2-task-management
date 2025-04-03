/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUserAuthenticated = require('../../../middlewares/isUserAuthenticated.js');
const { GetSubCategories } = require('../../../controllers/user/accounts/UserSubCategoryController.js');

const router = express.Router();

router.route('/GetCategories')
    .get(GetSubCategories);

module.exports = { SubCategoryRoutes: router };