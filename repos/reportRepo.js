const Report = require('../models/report');

let reportRepo = {
    insert: function (checkId){
        const report = new Report({
            checkId: checkId
        });
        report.save()
            .catch(err => {
                this.handleError(err)
            });
    },
    update:function (checkId,reportData){

        Report.updateOne({checkId:checkId}, reportData)
            .catch(err =>{
                console.log(err)
            })
    }
}

module.exports = reportRepo;
