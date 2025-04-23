const user = require('../Routes/user');
const { mailService } = require('../services/mailService');
const cron = require('node-cron');

const startCronJobs = (transporter, users) => {
    console.log("Inside startCronJobs function");
    const job = cron.schedule('54 14 * * *', () => {
        users.forEach(user => {
            mailService(user);
        });
    });
    job.start(transporter);
};

module.exports = { startCronJobs };