const cron = require('node-cron');
// const GetTasks = require('../../helpers/cron/GetTasks');
const { SendMail } = require('../../helpers/mail/SendMail');
const { GetTasks } = require('../../helpers/cron/GetTasks');
const { getAdmin } = require('../../helpers/mail/GetAdmin');

const startCronJobs = () => {

    const job = cron.schedule('0 20 * * *', async () => {
        const tasks = await GetTasks();
        const admin = await getAdmin();
        SendMail(admin, tasks);
    });

    job.start();
};

module.exports = { startCronJobs };