/**
 * @name middlewareIndex
 * @file index.js
 * @param {Request} req
 * @param {Response} res
 * @throwsF
 * @description This file will import all models.
 * @author Jaydev Dwivedi (Zignuts)
 */
const { User } = require('./User');
const { Admin } = require('./Admin');
const { Task } = require("./Task");

module.exports = {
    User,
    Admin,
    Task
};