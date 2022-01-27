/*
-The Notification Queue  will receive notifications
*/

const { Queue: QueueMQ, Worker, QueueScheduler } = require('bullmq');
require('./notification.worker');
const config = require("../config");

const redisOptions = {
    port: config.connection.port,
    host: config.connection.host,
    password: '',
    tls: false,
};
const notificationQueueMQ =  new QueueMQ(config.notificationQueueName, { connection: redisOptions });

//Producer
const sendNotification = (data) => {
    console.log('we are here ready to send sendNotification')
    notificationQueueMQ.add("notificationMessage",data, {
        attempts: 5, backoff: { type: "exponential", delay: 3000 }
    }).catch(err=>{
        console.log('failed to send')
    } )
};
module.exports.sendNotification = sendNotification
module.exports.notificationQueueMQ = notificationQueueMQ
