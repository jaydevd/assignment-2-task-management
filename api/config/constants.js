const STATUS = {
    IN_PROGRESS: 'in-progress',
    PENDING: 'pending',
    DONE: 'done',
    TO_DO: 'to-do',
    ON_HOLD: 'on-hold',
    IN_REVIEW: 'in-review',
    CANCELLED: 'cancelled',
    POSTPONED: 'postponed'
}

const ADMIN = {
    NAME: "Admin",
    EMAIL: "admin2025@gmail.com"
}

const USER_POSITIONS = {
    TEAM_LEAD: "team-lead",
    JR_SDE: "jr-sde",
    SR_SDE: "sr-sde",
    INTERN: "intern",
    MANAGER: "manager"
}

const PROJECT_ROLES = {
    TEAM_LEAD: "team-lead",
    MANAGER: "manager",
    DEVELOPER: "developer",
    TESTER: "tester"
}

const SMTP = {
    SUBJECT: "Daily task summary"
}

const SOCKET_EVENTS = {
    REGISTER: "register",
    TASK_UPDATE: "task_update",
    DISCONNECT: "disconnect"
}

const IO_EVENTS = {
    CONNECTION: "connection"
}

const NOTIFICATION = {
    TITLE: "Task Management System",
    BODY: "Task updated"
}

const REDIS = {
    CONNECTION_URL: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
}

const GENDER = {
    MALE: "male",
    FEMALE: "female"
}

const HTTP_STATUS_CODES = {

    SERVER_ERROR: {
        INTERNAL_SERVER_ERROR: 500,
    },
    CLIENT_ERROR: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404
    },
    REDIRECTION_ERROR: 300,
    SUCCESS: {
        OK: 200,
        CREATED: 201
    },
}

module.exports = {
    STATUS,
    HTTP_STATUS_CODES,
    ADMIN,
    USER_POSITIONS,
    SMTP,
    SOCKET_EVENTS,
    IO_EVENTS,
    NOTIFICATION,
    REDIS,
    PROJECT_ROLES,
    GENDER
}