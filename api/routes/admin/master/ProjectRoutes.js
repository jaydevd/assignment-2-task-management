/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const {
    ListProjects,
    CreateProject,
    UpdateProject,
    DeleteProject
} = require('../../../controllers/admin/master/ProjectController');
const { isAdmin } = require('./../../../middleware/isAdmin');

const router = express.Router();

router.route('/list')
    .all(isAdmin)
    .get(ListProjects);

router.route('/create')
    .all(isAdmin)
    .post(CreateProject);

router.route('/update')
    .all(isAdmin)
    .post(UpdateProject);

router.route('/delete')
    .all(isAdmin)
    .post(DeleteProject);

module.exports = { ProjectRoutes: router };