const { Worker , QueueScheduler } = require('bullmq')
const config = require("../config");
let i = 0;
console.log('define worker')
i = i+1
console.log(i)
const mailWorker = new Worker(config.mailQueueName, `${__dirname}/mail.processor.js`, {
    connection:config.connection,
    concurrency:config.concurrency,
    limiter: config.limiter,
})
const mailScheduler = new QueueScheduler(config.mailQueueName, {
    connection: config.connection,
});

mailWorker.on("completed", (job) =>
    console.log(`Completed job ${job.id} successfully`)
);
mailWorker.on("failed", (job, err) =>
    console.log(`Failed job ${job.id} with ${err}`)
);
console.info('Worker listening for jobs')

module.exports = {
    mailWorker,
    mailScheduler
}
