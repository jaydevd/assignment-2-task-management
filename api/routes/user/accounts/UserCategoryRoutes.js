/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUserAuthenticated = require('../../../middlewares/isUserAuthenticated.js');
const { GetCategories } = require('../../../controllers/user/accounts/UserCategoryController.js');

const router = express.Router();

router.route('/GetCategories')
    .get(GetCategories);

module.exports = { UserCategoryRoutes: router };