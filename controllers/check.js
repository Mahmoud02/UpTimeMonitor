const path = require('path');

const { validationResult } = require('express-validator/check');

const Check = require('../models/check');
const  monitorBootstrap = require('../helpers/monitorUtils').monitorBootstrap
const monitorRemove = require("../helpers/monitorUtils").monitorRemove;
exports.getChecks = (req, res, next) => {

    let totalItems;
    Check.find()
        .countDocuments()
        .then(count => {
            totalItems = count;
            return Check.find();

        })
        .then(checks => {
            res
                .status(200)
                .json({
                    message: 'Fetched checks successfully.',
                    data: checks,
                    totalItems: totalItems
                });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createCheck = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const name = req.body.name;
    const linkUrl = req.body.linkUrl;
    const protocol = req.body.protocol;
    const userId = req.body.userId;
    const check = new Check({
        name: name,
        linkUrl: linkUrl,
        protocol: protocol,
        userId: userId
    });
    check
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Check created successfully!',
                post: result
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getCheck = (req, res, next) => {
    const checkId = req.params.checkId;
    Check.findById(checkId)
        .then(check => {
            if (!check) {
                const error = new Error('Could not find check.');
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'check fetched.', check: check });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateCheck = (req, res, next) => {
    const checkId = req.params.checkId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const name = req.body.name;
    const linkUrl = req.body.linkUrl;
    const protocol = req.body.protocol;

    Check.findById(checkId)
        .then(check => {
            if (!check) {
                const error = new Error('Could not find check.');
                error.statusCode = 404;
                throw error;
            }
            check.name = name;
            check.linkUrl = linkUrl;
            check.protocol = protocol;
            return check.save();
        })
        .then(result => {
            res.status(200).json({ message: 'check updated!', post: result });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.deleteCheck = (req, res, next) => {
    const checkId = req.params.checkId;
    Check.findById(checkId)
        .then(check => {
            if (!check) {
                const error = new Error('Could not find check.');
                error.statusCode = 404;
                throw error;
            }
            // Check logged in user
            return Check.findByIdAndRemove(checkId);
        })
        .then(result => {
            res.status(200).json({ message: 'Deleted Check.' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.updateListenStatus = (req, res, next) =>{
    const CheckId = req.params.checkId;


    Check.findById(CheckId)
        .then(check => {
            if (!check) {
                const error = new Error('Could not find check.');
                error.statusCode = 404;
                throw error;
            }
            check.listenStatus = ! check.listenStatus
            return check.save();
        })
        .then(checkObj => {
            if(checkObj.listenStatus){
                console.log('i am here monitorBootstrap ')
                monitorBootstrap(checkObj)
            }else {
                console.log('i am here monitorRemove ')
                monitorRemove(checkObj._id)
            }
            res.status(200).json({ message: 'listenStatus updated!', post: checkObj });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
