const express = require('express');

const { AuthRoutes } = require('./auth/AuthRoutes.js');
const { MasterRoutes } = require('./master/index.js');
const { DropDownRoutes } = require('./dropDown/DropDownRoutes.js');

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/master', MasterRoutes);
router.use('/drop-down', DropDownRoutes);

module.exports = { AdminRoutes: router };