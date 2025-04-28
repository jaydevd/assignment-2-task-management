const express = require('express');
const { UpdateProfile } = require('./../../../controllers/user/profile/ProfileController');
const { isUser } = require('./../../../middleware/isUser');
const router = express.Router();

router.route('/update')
    .all(isUser)
    .post(UpdateProfile);

module.exports = { ProfileRoutes: router }; 