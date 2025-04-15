/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isAdmin = require('../../../middlewares/isAdmin.js');
const { AddCountry, DeleteCountry, ListCountries, AddCity } = require('./../../../controllers/admin/master/CountryController.js');

const router = express.Router();

router.route('/add')
    .all(isAdmin)
    .post(AddCountry);

router.route('/add-city')
    .all(isAdmin)
    .post(AddCity);

router.route('/delete')
    .all(isAdmin)
    .post(DeleteCountry);

router.route('/list-countries')
    .all(isAdmin)
    .get(ListCountries);

module.exports = { CountryRoutes: router }; 
