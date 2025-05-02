const express = require('express');
const { LogIn, LogOut, SignUp, ForgotPassword, ResetPassword } = require('../../../controllers/user/auth/AuthController');
const { isUser } = require('../../../middleware/isUser');

const router = express.Router();

router.route('/signup')
    .post(SignUp);

router.route('/login')
    .post(LogIn);

router.route('/logout')
    .all(isUser)
    .post(LogOut);

router.route('/forgot-password')
    .post(ForgotPassword);

router.route('/reset-password/:token')
    .get(ResetPassword);

module.exports = { AuthRoutes: router };