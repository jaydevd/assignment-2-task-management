const express = require('express');
const router = express.Router();
const { GetUsers } = require('./../../../controllers/admin/DropDownController');

router.route('/users')
    .get(GetUsers);

module.exports = { DropDownRoutes: router };