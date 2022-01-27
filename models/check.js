const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        linkUrl: {
            type: String,
            required: true
        },
        protocol: {
            type: String,
            default: "http",
            enum: ['http', 'https', 'tcp']
        },
        userId: {
            type: String,
            required: true
        },
        listenStatus: {
            type: Boolean,
            default: false,

        },
        port : {
            type: Number,

        },
        webhookURL: {
            type: String,

        },
        timeout : {
            type: Number,
        },
        interval : {
            type: Number,
            default: 10,

        },
        threshold : {
            type: Number,
            default: 1,

        },
        authenticationHeader  : {
            username: String,
            password:  String,
        },
        // keys are always strings.
        httpHeaders : {
            type: Map,
            of: String
        },
        assert  : {
            type: String,

        },
        tags   : {
            type: String,

        },
        ignoreSSL    : {
            type: String,

        },

    },
);

module.exports = mongoose.model('Check', checkSchema);
