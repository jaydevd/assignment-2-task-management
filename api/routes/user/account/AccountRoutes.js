/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUser = require('./../../../middlewares/isUser');
const { CreateAccount,
    ListAccounts,
    UpdateAccount,
    DeleteAccount } = require('./../../../controllers/user/account/AccountController.js');

const router = express.Router();

router.route('/ListAccounts')
    .all(isUser)
    .get(ListAccounts);

router.route('/create')
    .all(isUser)
    .post(CreateAccount);

router.route('/update')
    .all(isUser)
    .post(UpdateAccount);

router.route('/delete')
    .all(isUser)
    .post(DeleteAccount);

module.exports = { AccountRoutes: router };