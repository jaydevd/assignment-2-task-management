const nodemailer = require('nodemailer');
const path = require('path');
const hbs = require('nodemailer-express-handlebars').default;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jaydevdwd@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
    },
});

const handlebarOptions = {
    viewEngine: {
        extname: '.hbs',
        partialsDir: path.resolve('./templates/partials'),
        layoutsDir: path.resolve('./templates'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./templates'),
    extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

module.exports = transporter;