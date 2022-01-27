/*
* Monitor master is the wrapper of the [monitor]
* Monitor master is the interface between app modules and the monitor object
* Monitor master is responsible for trigger actions based on [Monitor] events
* We identify Monitor Master be checkId[Unique identifier] to track it by using that identifier
* Monitor Master save userId to use it later .
*/
const Monitor = require('ping-monitor');
const Report = require('../models/report');
const  reportRepo = require('../repos/reportRepo')
const sendNotification = require('../Notification/notification.queue').sendNotification;
const  userRepo = require('../repos/userRepo')

class MonitorMaster {
    /*
    *Monitor is responsible for pulling and repeat the polling operation based on interval value
    *Monitor is also responsible for generating Report based on pull result
    *Monitor is also responsible for trigger event based on pulling result
    ,these events is consumed and handled by MonitorMaster
    */
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
    /*
    * this function saves report data directly into database
    * but Reports are updated based on interval times and interval time may be 5 minutes
    * with more monitors running we will hit our main database many times for repeating the update action
    * based on that,maybe we will need to use cache memory between our app and the main database
     */
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
