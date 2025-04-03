/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUserAuthenticated = require('../../../middlewares/isUserAuthenticated.js');
const { GetCities } = require('../../../controllers/user/profile/UserCityController.js');

const router = express.Router();

router.route('/GetCities')
    .get(GetCities);

module.exports = { CityRoutes: router };