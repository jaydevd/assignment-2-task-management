/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { GetCountries, GetCategories, GetCities, GetSubCategories } = require('./../../controllers/admin/DropDownController.js');
const { MasterRoutes } = require('./master/index.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/master', MasterRoutes);

router.route('/drop-down/countries')
    .get(GetCountries);

router.route('/drop-down/categories')
    .get(GetCategories);

router.route('/drop-down/sub-categories')
    .get(GetSubCategories);

router.route('/drop-down/cities')
    .get(GetCities);

module.exports = { AdminRoutes: router };