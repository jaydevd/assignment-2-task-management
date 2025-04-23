const transporter = require("../config/transporter");

const mailService = (user, context) => {

    transporter.sendMail({
        from: 'api smtp@mailtrap.io',
        to: `${user.name} ${user.email}`,
        subject: 'Test mail',
        template: 'index',
        context: { context }
    })
}

module.exports = { mailService };