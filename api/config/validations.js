const { STATUS, USER_POSITIONS, GENDER, PROJECT_ROLES } = require('./constants');

const COMMON_RULES = {
    ID: "required|string|max:60",
    NAME: "required|max:64",
    EMAIL: "required|email|max:60",
    DATE: "required|date",
    PASSWORD: "required|max:60",
    TOKEN: "string|max:200"
}

const VALIDATION_RULES = {
    USER: {
        ID: COMMON_RULES.ID,
        NAME: COMMON_RULES.NAME,
        EMAIL: COMMON_RULES.EMAIL,
        PHONE_NUMBER: "required|integer|max:10",
        ADDRESS: "required|string|max:300",
        JOINED_AT: COMMON_RULES.DATE,
        GENDER: `required|string|in:${Object.values(GENDER).join(",")}`,
        POSITION: `required|string|in:${Object.values(USER_POSITIONS).join(",")}`,
        PASSWORD: COMMON_RULES.PASSWORD,
        TOKEN: COMMON_RULES.TOKEN
    },
    ADMIN: {
        ID: COMMON_RULES.ID,
        NAME: COMMON_RULES.NAME,
        EMAIL: COMMON_RULES.EMAIL,
        PASSWORD: COMMON_RULES.PASSWORD,
        TOKEN: COMMON_RULES.TOKEN
    },
    TASK: {
        ID: COMMON_RULES.ID,
        TITLE: "required|string|max:200",
        STATUS: `required|string|in:${Object.values(STATUS).join(",")}`,
        USER_ID: COMMON_RULES.ID,
        DUE_DATE: COMMON_RULES.DATE,
        PROJECT_ID: COMMON_RULES.ID
    },
    PROJECT: {
        ID: COMMON_RULES.ID,
        NAME: COMMON_RULES.NAME,
    },
    COMMENT: {
        ID: COMMON_RULES.ID,
        TASK_ID: COMMON_RULES.ID,
        COMMENT: "required|string|max:200",
        USER_ID: COMMON_RULES.ID
    },
    PROJECT_MEMBERS: {
        ID: COMMON_RULES.ID,
        PROJECT_ID: COMMON_RULES.ID,
        USER_ID: COMMON_RULES.ID,
        ROLE: `required|string|in:${Object.values(PROJECT_ROLES).join(",")}`
    }
}

module.exports = { VALIDATION_RULES }