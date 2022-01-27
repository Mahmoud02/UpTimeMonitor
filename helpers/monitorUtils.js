const monitorMaster = require('./monitor')
const MonitorStore = require('./MonitorStore')
const monitorBootstrap = (checkObj) =>{

    let monitor = new monitorMaster(
        checkObj._id.toString(),
        checkObj.name,
        checkObj.protocol,
        checkObj.linkUrl,
        checkObj.userId
    );
    monitor.createMonitor()
    monitor.createMonitorReport()
    monitor.registerEventsListener()
    monitor.startListener()

    MonitorStore.addMonitorForChecker(monitor._id.toString(),monitor)

    return true;
}
const monitorRemove = (monitorId) =>{
    let monitorMaster = MonitorStore.getCheckerMonitor(monitorId.toString())
    monitorMaster.monitor.clearInterval();
    cleanMemory(monitorMaster)
    MonitorStore.deleteCheckerMonitor(monitorId.toString())
    console.log(MonitorStore.getCounts())
    console.log( monitorMaster)
    return true;
}
function cleanMemory(monitorMaster){
    delete  monitorMaster.monitor;
    delete monitorMaster._id;
    delete monitorMaster.name;
    delete monitorMaster.protocol;
    delete monitorMaster.linkUrl;
    delete monitorMaster.getMonitor;
}
module.exports.monitorBootstrap = monitorBootstrap;
module.exports.monitorRemove = monitorRemove;
