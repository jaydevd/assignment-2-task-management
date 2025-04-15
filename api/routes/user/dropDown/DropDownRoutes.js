/**
 * @name dropDownRoutes
 * @file dropDownRoutes.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');


const { GetCountries, GetCategories, GetCities, GetSubCategories } = require('./../../../controllers/user/DropdownController');

const router = express.Router();

router.route('/countries')
    .get(GetCountries);

router.route('/categories')
    .get(GetCategories);

router.route('/sub-categories')
    .get(GetSubCategories);

router.route('/cities')
    .get(GetCities);

module.exports = { DropDownRoutes: router };