const cron = require('node-cron');
// const GetTasks = require('../../helpers/cron/GetTasks');
const { SendMail } = require('../../helpers/mail/SendMail');
const { GetTasks } = require('../../helpers/cron/GetTasks');

const startCronJobs = () => {

    const job = cron.schedule('0 20 * * *', async () => {
        const context = await GetTasks();
        SendMail(context);
    });

    job.start();
};

module.exports = { startCronJobs };