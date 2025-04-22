const { mailService } = require('../services/mailService');
const cron = require('node-cron');

const startCronJobs = (transporter, to, user) => {
    console.log("Inside startCronJobs function");
    const job = cron.schedule('54 14 * * *', () => {
        mailService(to, user);
    });
    job.start(transporter);
};

module.exports = { startCronJobs };