/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const router = express.Router();
const { GetUsers } = require('./../../../controllers/admin/DropDownController');

router.route('/users')
    .get(GetUsers);

module.exports = { DropDownRoutes: router };