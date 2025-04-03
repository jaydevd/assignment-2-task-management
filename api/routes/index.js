/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');

const { AdminAuthRoutes } = require('./admin/authentication/AdminAuthRoutes.js');
const { CategoryRoutes } = require('./admin/master/CategoryRoutes.js');
const { SubCategoryRoutes } = require('./admin/master/SubCategoryRoutes.js');
const { CountryRoutes } = require('./admin/master/CountryRoutes.js');
const { CityRoutes } = require('./admin/master/CityRoutes.js');
const { UsersRoutes } = require('./admin/master/UsersRoutes.js');

const { UserAuthRoutes } = require('./user/authentication/UserAuthRoutes.js');
const { AccountRoutes } = require('./user/accounts/AccountRoutes.js');
const { ProfileRoutes } = require('./user/profile/ProfileRoutes.js');
const { UserCategoryRoutes } = require('./user/accounts/UserCategoryRoutes.js');
const { UserSubCategoryRoutes } = require('./user/accounts/UserSubCategoryRoutes.js');
const { UserCountryRoutes } = require('./user/profile/UserCountryRoutes.js');
const { UserCityRoutes } = require('./user/profile/UserCityRoutes.js');

const router = express.Router();

// user routes
router.use('/user/authentication', UserAuthRoutes);
router.use('/user/accounts', AccountRoutes);
router.use('/user/Category', UserCategoryRoutes);
router.use('/user/SubCategory', UserSubCategoryRoutes);
router.use('/user/profile', ProfileRoutes);
router.use('/user/Country', UserCountryRoutes);
router.use('/user/City', UserCityRoutes);

// admin routes
router.use('/admin/authentication', AdminAuthRoutes);
router.use('/admin/master/Category', CategoryRoutes);
router.use('/admin/master/SubCategory', SubCategoryRoutes);
router.use('/admin/master/Country', CountryRoutes);
router.use('/admin/master/city', CityRoutes);
router.use('/admin/master/Users', UsersRoutes);

module.exports = router;