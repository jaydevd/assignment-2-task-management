const express = require('express');
const {
    ListProjects,
    CreateProject,
    UpdateProject,
    DeleteProject,
    AddMember,
    DeleteMember
} = require('../../../controllers/admin/project/ProjectController');
const { isAdmin } = require('../../../middleware/isAdmin');

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

router.route('/add-member')
    .all(isAdmin)
    .post(AddMember);

router.route('/delete-member')
    .all(isAdmin)
    .post(DeleteMember);
module.exports = { ProjectRoutes: router };