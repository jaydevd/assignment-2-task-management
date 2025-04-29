const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../../middleware/isAdmin');
const { LogIn, LogOut, ForgotPassword, ResetPassword } = require('../../../controllers/admin/auth/AuthController');

router.route('/login')
    .post(LogIn);

router.route('/logout')
    .all(isAdmin)
    .post(LogOut);

router.route('/forgot-password')
    .post(ForgotPassword);

router.route('/reset-password/:token')
    .post(ResetPassword);

module.exports = { AuthRoutes: router };