/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { UpdateProfile } = require('./../../../controllers/user/profile/ProfileController');
const { isUser } = require('./../../../middlewares/isUser');
const router = express.Router();

router.route('/update')
    .all(isUser)
    .post(UpdateProfile);

module.exports = { ProfileRoutes: router }; 