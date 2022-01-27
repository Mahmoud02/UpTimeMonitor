

class MonitorStore {
     collection = new Map();
     constructor(){
         MonitorStore.instance=this;
     }
     addMonitorForChecker(checkerId, monitor){
         this.collection.set(checkerId, monitor);
     }
     deleteCheckerMonitor(checkerId){
         this.collection.delete(checkerId)
     }
     getCheckerMonitor(checkerId){

        return this.collection.get(checkerId);
     }
     getCounts(){
         return this.collection.size;
     }
     clearAllMonitors(){
         this.collection.clear()
     }

}
module.exports = new MonitorStore();

