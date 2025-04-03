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
router.route('/user/authentication', UserAuthRoutes);
router.route('/user/accounts', AccountRoutes);
router.route('/user/Category', UserCategoryRoutes);
router.route('/user/SubCategory', UserSubCategoryRoutes);
router.route('/user/profile', ProfileRoutes);
router.route('/user/Country', UserCountryRoutes);
router.route('/user/City', UserCityRoutes);

// admin routes
router.route('/admin/authentication', AdminAuthRoutes);
router.route('/admin/master/Category', CategoryRoutes);
router.route('/admin/master/SubCategory', SubCategoryRoutes);
router.route('/admin/master/Country', CountryRoutes);
router.route('/admin/master/city', CityRoutes);
router.route('/admin/master/Users', UsersRoutes);



module.exports = router;