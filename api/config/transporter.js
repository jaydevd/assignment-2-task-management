const nodemailer = require('nodemailer');
const path = require('path');
const handlebars = require('handlebars');
const { GetTasks } = require('../helpers/cron/GetTasks');

let transporter;

try {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        pool: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
    });

} catch (error) {
    throw new Error(error);
}

module.exports = { transporter };