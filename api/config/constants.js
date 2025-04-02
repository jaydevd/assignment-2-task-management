/**
 * @name Constants
 * @file constants.js
 * @throwsF
 * @description This file will contain all constants used across the API.
 * @author Jaydev Dwivedi (Zignuts)
 */

const HTTP_STATUS_CODES = {

    INTERNAL_SERVER_ERROR: 500,
    CLIENT_ERROR: 400,
    REDIRECTION_ERROR: 300,
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403
}

module.exports = {
    HTTP_STATUS_CODES
}