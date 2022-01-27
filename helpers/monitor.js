const Monitor = require('ping-monitor');
const Report = require('../models/report');
const  reportRepo = require('../repos/reportRepo')
const sendNotification = require('../Notification/notification.queue').sendNotification;
const  userRepo = require('../repos/userRepo')

class MonitorMaster {
    monitor ;
    constructor(_id,name, protocol,url,userId) {
        this._id = _id;
        this.name = name;
        this.protocol = protocol;
        this.linkUrl = url;
        this.userId = userId
    }

    createMonitor() {
      this.monitor =  new Monitor({
            website: this.linkUrl,
            title: this.name,
            ignoreSSL: false,
            interval: 60, //
            config: {
                intervalUnits: 'seconds' // seconds, milliseconds, minutes {default}, hours
            },
        });
      //stop monitor until create Report
      this.monitor.stop()
    }
    createMonitorReport(){
        reportRepo.insert(this._id)
    }
    startListener(){
        this.monitor.start(this.protocol)
    }
    registerEventsListener(){
        this.monitor.on('up', (res, state) =>{
            this.updateReport(this.monitor.getReport())
            this.findUserToSendNotification("we found your server is up during last check")
        });


        this.monitor.on('down', (res) =>{
            this.updateReport(this.monitor.getReport())
            this.findUserToSendNotification("we found your server is down during last check")

        });

        this.monitor.on('stop', (website=>{
            this.findUserToSendNotification("'Stop Monitoring 'Our Monitor Service is not monitor your website")

        }));

        this.monitor.on('error',(error) => {
            this.findUserToSendNotification("'Stop Monitoring 'Our Monitor Service is not monitor your website")
        });

        this.monitor.on('timeout ', (err) =>{
            this.findUserToSendNotification("'timeout 'we cant pulling your website")
        });
    }
     getMonitor = () =>{
        if(this.monitor)
            return this.monitor;
        throw 'No database Found'
    }
    handleError= (err) =>{
        console.log('errors')
        throw new Error(err)
    }
    updateReport(reportData){
        reportRepo.update(this._id,reportData)
    }
    findUserToSendNotification(notificationMsg){
        userRepo.find({userId:this.userId}).then(user =>{
            let notificationData ={
                user:{
                    name:user.name,
                    email:user.email
                },
                msg:notificationMsg,
                tittle:"Uptime Alert msg"
            }
            sendNotification(notificationData)
        }).catch(err =>{
            console.log("error during sending notification for the user")
        })
    }
}

log = ()=>{
    MonitorMaster.get
}



module.exports = MonitorMaster;
