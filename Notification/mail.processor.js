const emailSender = require('../helpers/mail')

/*
DataFormat
user:{
         name:user.name,
         email:user.email
       },
msg:msg,
tittle:tittle
}
*/
module.exports = async job => {
    try {
        let data = job.data;
       emailSender(data.tittle,data.msg,data.msg,data.user.email)
    } catch (e) {
        console.error(e)
    }
}

