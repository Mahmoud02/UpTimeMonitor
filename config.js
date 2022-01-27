require('dotenv').config()
module.exports = {
    sendgridApiKey: process.env.sendgridApiKey,
    sender: "mahmoudreda027@gmail.com",
    Sign_key:"qwertsasdsadfmmhhjhgggf",
    mailQueueName: process.env.QUEUE_NAME || 'mailQueue',
    notificationQueueName: process.env.QUEUE_NAME || 'notificationQueue',
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY, 10) || 1,
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || '6379',
    },
    limiter: {
        max: parseInt(process.env.MAX_LIMIT, 10) || 1,
        duration: parseInt(process.env.DURATION_LIMIT, 10) || 1000,
    },
    sendgrid: {
        sendgridApiKey: process.env.sendgridApiKey,
        sender: "mahmoudreda027@gmail.com",
    },
}
