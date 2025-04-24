/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const { ListProjects } = require('./../../../controllers/user/project/ProjectController');
const { isUser } = require('./../../../middleware/isUser');
const router = express.Router();

router.route('/list')
    .all(isUser)
    .get(ListProjects);

module.exports = { ProjectRoutes: router }; 