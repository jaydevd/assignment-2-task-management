const transporter = require("../config/transporter");

const mailService = (to, user) => {

    transporter.sendMail({
        from: 'api smtp@mailtrap.io',
        to: to,
        subject: 'Bulk Email Test',
        template: 'index',
        context: user
    })
}

module.exports = { mailService };