/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { UserAuthRoutes } = require('./user/authentication/AuthRoutes.js');
const { AccountRoutes } = require('./user/accounts/AccountRoutes.js');
const { ProfileRoutes } = require('./user/profile/ProfileRoutes.js');
const { UserCategoryRoutes } = require('./user/accounts/UserCategoryRoutes.js');
const { UserSubCategoryRoutes } = require('./user/accounts/UserSubCategoryRoutes.js');
const { UserCountryRoutes } = require('./user/profile/UserCountryRoutes.js');
const { UserCityRoutes } = require('./user/profile/UserCityRoutes.js');

const router = express.Router();

router.use('/user/authentication', UserAuthRoutes);
router.use('/user/accounts', AccountRoutes);
router.use('/user/Category', UserCategoryRoutes);
router.use('/user/SubCategory', UserSubCategoryRoutes);
router.use('/user/profile', ProfileRoutes);
router.use('/user/Country', UserCountryRoutes);
router.use('/user/City', UserCityRoutes);

module.exports = { UserRoutes: router };