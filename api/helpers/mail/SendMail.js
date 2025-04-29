const { SMTP } = require("../../config/constants");
const transporter = require("../../config/transporter");
const handlebars = require('handlebars');

const SendMail = async (admin) => {
    try {
        const tasks = await GetTasks();
        const template = handlebars.compile(path.resolve(__dirname, '../templates/index'), { tasks });

        transporter.sendMail({
            from: `${process.env.SMTP_USER} ${process.env.SMTP_PASSWORD}`,
            to: `${admin.name} ${admin.email}`,
            subject: SMTP.SUBJECT,
            html: template
        });
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = { SendMail };