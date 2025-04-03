/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUserAuthenticated = require('../../../middlewares/isUserAuthenticated.js');
const { GetCountries } = require('../../../controllers/user/profile/UserCountryController.js');

const router = express.Router();

router.route('/GetCountries')
    .get(GetCountries);

module.exports = { UserCountryRoutes: router };