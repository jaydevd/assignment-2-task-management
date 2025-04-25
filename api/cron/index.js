/**
 * @name cronJob
 * @file index.js
 * @throwsF
 * @description This file will contain methods for Tasks.
 * @author Jaydev Dwivedi (Zignuts)
 */

const cron = require('node-cron');
const { mailService } = require('../services/mailService');
const { User, Project, Task } = require('../models');

const getData = async () => {
    try {
        const projects = await Project.findAll({ attributes: ['id', 'name', 'members'] });
        const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
        const tasks = await Task.findAll({ attributes: ['id', 'description', 'status', 'dueDate', 'user_id'] });

        return { projects, users, tasks };
    } catch (error) {
        console.log('Error fetching data:', error);
        return { projects: [], users: [], tasks: [] };
    }
};

const startCronJobs = () => {

    const job = cron.schedule('0 20 * * *', async () => {

        const { projects, users, tasks } = await getData();

        projects.forEach((project) => {
            let context = [];
            let sender = null;

            users.forEach((user) => {
                if (user.role === 'employee' && project.members.includes(user.id)) {
                    tasks.forEach((task) => {
                        if (task.user_id === user.id) {
                            context.push(task);
                        }
                    });
                }
                if (user.role === 'admin') {
                    sender = user;
                }
            });

            if (sender && context.length > 0) {
                mailService(sender, context);
            }
        });
    });

    job.start();
};

module.exports = { startCronJobs };