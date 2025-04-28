const express = require('express');
const { LogIn, LogOut, SignUp } = require('../../../controllers/user/auth/AuthController');
const { isUser } = require('../../../middleware/isUser');

const router = express.Router();

router.route('/signup')
    .post(SignUp);

router.route('/login')
    .post(LogIn);

router.route('/logout')
    .all(isUser)
    .post(LogOut);

module.exports = { AuthRoutes: router };