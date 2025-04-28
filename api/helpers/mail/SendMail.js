const { SMTP } = require("../../config/constants");
const transporter = require("../../config/transporter");

const SendMail = (user) => {

    transporter.sendMail({
        from: `${process.env.SMTP_USER} ${process.env.SMTP_PASSWORD}`,
        to: `${user.name} ${user.email}`,
        subject: SMTP.SUBJECT,
    })
}

module.exports = { SendMail };