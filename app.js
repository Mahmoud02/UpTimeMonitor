let express = require('express');
let app = express();
const mongoose = require('mongoose');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

let errorHelper = require('./helpers/errorHelpers');

const authRoutes = require('./routes/auth');
const checkRoutes = require('./routes/ckeck');
const mailQueueMQ = require('./Notification/mail.queue').mailQueueMQ;
const  notificationQueueMQ = require('./Notification/notification.queue').notificationQueueMQ;


//Configure middleware to support json data parsing in req Object
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/auth', authRoutes);
app.use('/checks', checkRoutes);

// Configure Exception
app.use(errorHelper.logErrors);
// Configure client error handler
app.use(errorHelper.clientErrorHandler);
// Configure catch-all exception middleware last
app.use(errorHelper.errorHandler);

const run = async () => {

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/ui');

    createBullBoard({
        queues: [
            new BullMQAdapter(mailQueueMQ),
            new BullMQAdapter(notificationQueueMQ),
        ],
        serverAdapter,
    });
    app.use('/ui', serverAdapter.getRouter());

    mongoose
        .connect(
            'mongodb://localhost:27017/UpTimeDb?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false'
        )
        .then(result => {
            console.log("connect to database")
        })
    console.log('For the UI, open http://localhost:3000/ui');
    console.log('Make sure Redis is running on port 6379 by default');

};
// eslint-disable-next-line no-console
 run().catch((e) => console.error(e));

module.exports = app;
