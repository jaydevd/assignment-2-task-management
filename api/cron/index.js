const user = require('../Routes/user');
const { mailService } = require('../services/mailService');
const cron = require('node-cron');
const { User, Project, Task } = require('../models');
const { sequelize } = require('../config/database');

const getData = async () => {
    try {
        const projects = await Project.findAll({ attributes: ['id', 'name', 'members'] });
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
        const tasks = await Task.findAll({ attributes: ['id', 'description', 'status', 'dueDate'] });

        return { projects, users, tasks };

    } catch (error) {
        console.log(error);
    }
}
const startCronJobs = async (transporter) => {
    try {

        console.log("Inside startCronJobs function");
        const job = cron.schedule('48 18 * * *', () => {
            let context;
            let sender;
            const { projects, users, tasks } = getData();
            projects.forEach((project) => {
                users.forEach((user) => {
                    if (user.role == 'employee' && project.members.includes(user.id)) {
                        tasks.forEach((task) => {
                            if (task.user_id == user.id) {
                                context.push(task);
                            }
                        })
                    }
                    if (user.role == 'admin') sender = admin;
                })
                mailService(transporter, sender, context);
                context = {};
            })
        });
        job.start(transporter);
    } catch (error) {
        console.log(error);
    }
};
startCronJobs();

module.exports = { startCronJobs };