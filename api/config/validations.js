/**
 * @name VALIDATION_RULES
 * @file validations.js
 * @throwsF
 * @description This file will contain all the validation rules of the models.
 * @author Jaydev Dwivedi (Zignuts)
 */

const { name } = require('ejs');
const { STATUS } = require('./constants');
const VALIDATION_RULES = {
    USER: {
        id: "string|max:60",
        name: "required|max:64",
        email: "required|email|max:60",
        role: "string|in:['admin','employee']",
        password: "required|max:60",
        token: "max:200"
    },
    ADMIN: {
        id: "string|max:60",
        name: "required|string",
        email: "required|email|max:60",
        password: "required|max:60",
        token: "max:200"
    },
    TASK: {
        id: "string|max:60",
        description: "required|string|max:200",
        status: `required|string|in:${Object.values(STATUS).join(",")}`,
        userId: "required|string|max:60",
        dueDate: "required|date",
        comments: "jsonb",
        projectId: "required|string|max:60"
    },
    PROJECT: {
        id: "required|string|max:60",
        name: "required|string|max:64",
        members: "required|array",
        "members.*": "string|max:60",
    },
    COMMENT: {
        taskId: "required|string|max:60",
        comment: "required|string|max:200",
        from: "required|string|max:60"
    }
}

module.exports = { VALIDATION_RULES }