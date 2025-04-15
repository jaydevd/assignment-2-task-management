/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUser = require('../../../middlewares/isUser.js');
const { GetCountries } = require('../../../controllers/user/DropdownController.js');

const router = express.Router();

router.route('/countries')
    .all(isUser)
    .get(GetCountries);

module.exports = { CountryRoutes: router };