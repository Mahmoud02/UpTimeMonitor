const { Queue: QueueMQ, Worker, QueueScheduler } = require('bullmq');
require('./mail.worker');
const config = require("../config");

const redisOptions = {
    port: config.connection.port,
    host: config.connection.host,
    password: '',
    tls: false,
};
const mailQueueMQ =  new QueueMQ(config.mailQueueName, { connection: redisOptions });

//Producer
const sendEmail = (data) => {
    console.log('we are here ready to send')
    mailQueueMQ.add("mailMessage",data, {
        attempts: 5, backoff: { type: "exponential", delay: 3000 }
    }).catch(err=>{
        console.log('failed to send')
    } )
};
module.exports.sendEmail = sendEmail
module.exports.mailQueueMQ = mailQueueMQ
