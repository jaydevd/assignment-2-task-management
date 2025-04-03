/**
 * @name routesIndex
 * @file index.js
 * @throwsF
 * @description This file will import all routes.
 * @author Jaydev Dwivedi (Zignuts)
 */

const express = require('express');
const isUserAuthenticated = require('./../../../middlewares/isUserAuthenticated');
const { CreateAccount,
    ListAccounts,
    UpdateAccount,
    DeleteAccount,
    FilterAccounts,
    SearchAccount } = require('./../../../controllers/user/accounts/AccountController.js');

const router = express.Router();

router.route('/ListAccounts')
    .all(isUserAuthenticated)
    .get(ListAccounts);

router.route('/CreateAccount')
    .all(isUserAuthenticated)
    .post(CreateAccount);

router.route('/UpdateAccount')
    .all(isUserAuthenticated)
    .post(UpdateAccount);

router.route('/DeleteAccount')
    .all(isUserAuthenticated)
    .get(DeleteAccount);

router.route('/SearchAccount')
    .all(isUserAuthenticated)
    .get(SearchAccount);

router.route('/FilterAccounts')
    .all(isUserAuthenticated)
    .get(FilterAccounts);

router.route('/DeleteAccount')
    .all(isUserAuthenticated)
    .post(DeleteAccount);

module.exports = { AccountRoutes: router }; 