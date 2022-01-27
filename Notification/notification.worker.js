/*
-The Main Job of Notification Worker is to route the [Notification message] to different handlers
-The handler will be responsible of processing  the message
-The handler may be
    *object that send post based on the webhook url
    *sms service ,etc
    *Queue that will pass the message to another worker
*/
const { Worker , QueueScheduler } = require('bullmq')
const config = require("../config");
let x = 6;
console.log('define notificationWorker')
x = x+1
console.log(x)
const notificationWorker = new Worker(config.notificationQueueName, `${__dirname}/notification.processor`, {
    connection:config.connection,
    concurrency:config.concurrency,
    limiter: config.limiter,
})
const notificationScheduler = new QueueScheduler(config.notificationQueueName, {
    connection: config.connection,
});

notificationWorker.on("completed", (job) =>
    console.log(`Completed job ${job.id} successfully`)
);
notificationWorker.on("failed", (job, err) =>
    console.log(`Failed job ${job.id} with ${err}`)
);
console.info('Worker listening for jobs')

module.exports = {
    notificationWorker,
    notificationScheduler
}
