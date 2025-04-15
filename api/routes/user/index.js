/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { AccountRoutes } = require('./account/AccountRoutes.js');
const { ProfileRoutes } = require('./profile/ProfileRoutes.js');
const { CategoryRoutes } = require('./account/CategoryRoutes.js');
const { CountryRoutes } = require('./profile/CountryRoutes.js');
const { GetCountries, GetCategories, GetCities, GetSubCategories } = require('./../../controllers/user/DropdownController');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/account', AccountRoutes);
router.use('/category', CategoryRoutes);
router.use('/profile', ProfileRoutes);
router.use('/country', CountryRoutes);

router.route('/drop-down/countries')
    .get(GetCountries);

router.route('/drop-down/categories')
    .get(GetCategories);

router.route('/drop-down/sub-categories')
    .get(GetSubCategories);

router.route('/drop-down/cities')
    .get(GetCities);

module.exports = { UserRoutes: router };