const nodemailer = require('nodemailer');
const path = require('path');
const { GetTasks } = require('../helpers/cron/GetTasks');

let transporter;

try {
    transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

} catch (error) {
    throw new Error(error);
}

module.exports = { transporter };