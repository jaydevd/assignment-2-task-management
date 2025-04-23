const transporter = require("../config/transporter");

const mailService = (user) => {

    transporter.sendMail({
        from: 'api smtp@mailtrap.io',
        to: `${user.name} ${user.email}`,
        subject: 'Bulk Email Test',
        template: 'index',
        context: { task: user.description, dueDate: user.dueDate, status: user.status, name: user.name }
    })
}

module.exports = { mailService };