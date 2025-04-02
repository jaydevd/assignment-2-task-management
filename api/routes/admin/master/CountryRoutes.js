/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isAdminAuthenticated = require('./../../../middlewares/isAdminAuthenticated.js');
const { AddCountry, DeleteCountry, GetCountries } = require('./../../../controllers/admin/master/CountryController.js');

const router = express.Router();

router.route('/AddCountry')
    .all(isAdminAuthenticated)
    .post(AddCountry);

router.route('/DeleteCountry')
    .all(isAdminAuthenticated)
    .post(DeleteCountry);

router.route('/GetCountries')
    .get(GetCountries);

module.exports = { CountryRoutes: router }; 
