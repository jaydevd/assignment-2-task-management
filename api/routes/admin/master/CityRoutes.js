/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isAdminAuthenticated = require('./../../../middlewares/isAdminAuthenticated.js');
const { AddCity, DeleteCity, GetCities } = require('./../../../controllers/admin/master/CityController.js');

const router = express.Router();

router.route('/AddCity')
    .all(isAdminAuthenticated)
    .post(AddCity);

router.route('/DeleteCity')
    .all(isAdminAuthenticated)
    .post(DeleteCity);

router.route('/GetCities')
    .get(GetCities);

module.exports = { CityRoutes: router }; 
