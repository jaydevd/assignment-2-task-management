/**
 * @name Constants
 * @file constants.js
 * @throwsF
 * @description This file will contain all constants used across the API.
 * @author Jaydev Dwivedi (Zignuts)
 */

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
    HTTP_STATUS_CODES
}