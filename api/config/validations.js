const { STATUS } = require('./constants');
const VALIDATION_RULES = {
    USER: {
        id: "max:60",
        name: "required|max:64",
        email: "required|email|max:60",
        password: "required|max:60",
        token: "max:200"
    },
    ADMIN: {
        name: "required|string",
        email: "required|email|max:60",
        password: "required|max:60",
        token: "max:200"
    },
    TASK: {
        description: "required|string|max:200",
        status: `required|string|in:${Object.values(STATUS).join(",")}`,
        userId: "required|string|max:60",
        dueDate: "required|date",
        comments: "jsonb"
    },
    COMMENT: {
        comment: 'required|string|max:200',
        from: "required",
        to: "required",
        taskID: "required"
    }
}

module.exports = { VALIDATION_RULES }