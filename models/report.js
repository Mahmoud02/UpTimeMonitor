const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema(
    {
        status : {
            type: Number,
            required: true,
            default:false
        },
        availability : {
            type: String,
            required: true,
            default:0
        },
        outages : {
            type: Number,
            required: true,
            default:0
        },
        downtime : {
            type: String,
            required: true,
            default:0
        },
        uptime : {
            type: String,
            required: true,
            default:0
        },
        responseTime  : {
            type: String,
            required: true,
            default:0
        },
        history: {
            type: [Date] ,
            default: [],
            required: false
        },
       checkId: {
            type: String,
            required: true
        },
    },
);

module.exports = mongoose.model('Report', reportSchema);
