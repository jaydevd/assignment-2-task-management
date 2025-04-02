/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { EditProfile } = require('./../../../controllers/user/profile/ProfileController');
const isUserAuthenticated = require('./../../../middlewares/isUserAuthenticated');
const router = express.Router();

router.route('/EditProfile')
    .all(isUserAuthenticated)
    .post(EditProfile);

module.exports = { ProfileRoutes: router }; 