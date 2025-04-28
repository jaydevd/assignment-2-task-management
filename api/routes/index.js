const express = require('express');

const { AdminRoutes } = require('./admin/index');
const { UserRoutes } = require('./user/index');

const router = express.Router();

// user routes
router.use('/user', UserRoutes);
router.use('/admin', AdminRoutes);

module.exports = router;