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
const { DropDownRoutes } = require('./dropDown/DropDownRoutes.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/account', AccountRoutes);
router.use('/category', CategoryRoutes);
router.use('/profile', ProfileRoutes);
router.use('/drop-down', DropDownRoutes);

module.exports = { UserRoutes: router };