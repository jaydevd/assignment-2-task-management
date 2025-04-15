/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { ProfileRoutes } = require('./ProfileRoutes.js');
const { CountryRoutes } = require('./CountryRoutes.js');

const router = express.Router();

router.use('/profile', ProfileRoutes);
router.use('/country', CountryRoutes);

module.exports = { ProfileRoutes: router };