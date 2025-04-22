const VALIDATION_RULES = {
    USER: {
        id: "required|max:60",
        name: "required|max:64",
        email: "required|email|max:60",
        password: "required|max:60",
        token: "max:128"
    },
    ADMIN: {
        id: "required|string",
        name: "required|string",
        email: "required|email|max:60",
        password: "required|max:60",
        token: "max:128"
    },
    TASK: {

    }
}

module.exports = { VALIDATION_RULES }