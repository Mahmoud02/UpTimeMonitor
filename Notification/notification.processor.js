const sendEmail = require('./mail.queue').sendEmail;

module.exports = async job => {
    try {
        console.log("in Notification Processor")
        sendEmail(job.data)
    } catch (e) {
        console.error(e)
    }
}
