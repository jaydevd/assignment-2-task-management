/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { CountryRoutes } = require('./CountryRoutes');
const { CategoryRoutes } = require('./CategoryRoutes');
const { UsersRoutes } = require('./UsersRoutes');

const router = express.Router();

router.use('/country', CountryRoutes);
router.use('/category', CategoryRoutes);
router.use('/users', UsersRoutes);

module.exports = { MasterRoutes: router };