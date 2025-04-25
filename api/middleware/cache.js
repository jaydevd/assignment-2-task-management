/**
 * @name cronJob
 * @file index.js
 * @param {Request} req
 * @param {Response} res
 * @param {Next} next
 * @throwsF
 * @description This file contains method to fetch redis cache.
 * @author Jaydev Dwivedi (Zignuts)
 */
const { HTTP_STATUS_CODES } = require("../config/constants");
const client = require("../config/redis");

const cache = async (req, res, next) => {

    try {
        const user = await client.get('user');
        const tasks = await client.get('tasks');
        const users = await client.get('users');

        req.user = JSON.parse(user);
        req.tasks = JSON.parse(tasks);
        req.users = JSON.parse(users);
        next();

    } catch (err) {
        console.error(err);
        next();
    }
};

module.exports = { cache }