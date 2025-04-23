const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars').default;

const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    pool: true,
    auth: {
        user: 'api',
        pass: process.env.EMAIL_PASSWORD
    },
    maxMessages: Infinity,
    maxConnections: 5
});

const handlebarOptions = {
    viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve(__dirname, '../templates/partials'),
        layoutsDir: path.resolve(__dirname, '../templates'),
        defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, '../templates'),
    extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

module.exports = transporter;