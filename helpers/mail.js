const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const config = require("../config");

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: config.sendgridApiKey
        }
    })
);
const sendEmail = function (about,msg,text,email){
    let data = {
        from: config.sender,
        to: email,
        subject: about,
        text: text,
    };
    transporter.sendMail(data, function(err, info){
        if (err ){
            console.log(error);
        }
        else {
            console.log('Message sent: ' + info.message);
        }
    });

}
module.exports = sendEmail
