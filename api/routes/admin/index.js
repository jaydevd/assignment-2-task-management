/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { GetCountries, GetCategories } = require('./../../controllers/admin/DropDownController.js');
const { MasterRoutes } = require('./master/index.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/master', MasterRoutes);

router.route('/drop-down/countries')
    .get(GetCountries);

router.route('/drop-down/categories')
    .get(GetCategories);

module.exports = { AdminRoutes: router };