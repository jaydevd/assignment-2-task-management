/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const router = express.Router();
const { GetCountries, GetCategories, GetCities, GetSubCategories } = require('./../../../controllers/user/DropdownController');

router.route('/countries')
    .get(GetCountries);

router.route('/categories')
    .get(GetCategories);

router.route('/sub-categories')
    .get(GetSubCategories);

router.route('/cities')
    .get(GetCities);

module.exports = { DropDownRoutes: router };