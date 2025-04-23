const user = require('../Routes/user');
const { mailService } = require('../services/mailService');
const cron = require('node-cron');
const { SendMail } = require('./../controllers/user/mail/MailController');
const { User } = require('../models');
const { sequelize } = require('../config/database');

const getData = async () => {
    try {
        const users = await User.findAll({ attributes: ['name', 'email'] }, { where: { role: admin } });
        const query = `
        SELECT u.id AS user_id, u.name AS user_name, u.role, t.id AS task_id, t.title AS task_title, t.projectId
        FROM users u
        JOIN tasks t ON u.id = t.userId
        JOIN projects p ON t.projectId = p.id
        WHERE u.role = 'employee' AND
        u.id = ANY(p.members);
        `;
        const [mailContent, metadata] = await sequelize.query(query);
        return { mailContent, users };
    } catch (error) {
        console.log(error);
    }
}
const startCronJobs = async (transporter) => {
    try {

        console.log("Inside startCronJobs function");
        const job = cron.schedule('54 14 * * *', () => {
            const { mailContent, users } = getData();
            users.forEach(user => {
                mailService(user);
            });
        });
        job.start(transporter);
    } catch (error) {
        console.log(error);
    }
};

module.exports = { startCronJobs };