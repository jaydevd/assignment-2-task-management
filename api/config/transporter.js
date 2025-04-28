const nodemailer = require('nodemailer');
const path = require('path');

let transporter = new Object();
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

    transporter.use('compile', path.resolve(__dirname, '../templates/index.hbs'));

} catch (error) {
    throw new Error(error);
}

module.exports = { transporter };