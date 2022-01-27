const { body } = require('express-validator');
let checksValidators = {
    post: [
        body('name')
            .notEmpty().withMessage('name is required').bail()
            .isString().withMessage('the name  must be string value').bail()
            .trim().isLength({ min: 4 }).withMessage('the name length must be at least 4').bail()
            .custom((value, { req }) => {
                let result = value.match(".*[^0-9].*");
                if(result == null){
                    return Promise.reject('the name cant be only numbers');
                }

                return true;
            })
        ,
        body('linkUrl')
            .notEmpty().withMessage('linkUrl is required').bail()
            .isString().withMessage('the linkUrl  must be string value').bail()
            .isURL( ).withMessage('Invalid Link Url')
        ,
        body('protocol')
            .not().isEmpty().withMessage('protocol is required').bail()
            .isString().withMessage('the protocol  must be string value').bail()
            .custom((value, { req }) => {
                const supportedProtocols = ["http", "https", "tcp"];
                let protocol = value.toLowerCase();
                let  result = supportedProtocols.includes(protocol);
                if (!result ) {
                    return Promise.reject('Sry, we are not support this Protocol !');
                }
                return true;
            })
        ,
        body('ignoreSSL').optional()
            .isBoolean().withMessage('ignoreSSL must be boolean value')
        ,
        body('port').optional()
            .isPort().withMessage('invalid Port Number')
        ,
        body('webhookURL').optional()
            .isString().withMessage('the webhookURL  must be string value').bail()
            .isURL( ).withMessage('Invalid webhook URL')
        ,
        body('timeout').optional()
            .isNumeric( ).withMessage('Invalid timeout value').bail()
            .isInt ({min:0,max:20})
            .withMessage('timeout value must be int value  between 0 and  20')
        ,
        body('interval').optional()
            .isNumeric( ).withMessage('Invalid interval value').bail()
            .isInt ({min:10}).withMessage('interval value must be int value  greater than 10')
        ,
        body('threshold').optional()
            .isNumeric( ).withMessage('Invalid interval value').bail()
            .isInt ({min:1}).withMessage('threshold value must be int value greater than 1')
        ,
        body('authenticationHeader').optional()
            .custom((value, { req }) => {

                if(!( value.hasOwnProperty("username") &&  value.hasOwnProperty("password")) ){
                    return Promise.reject('Authentication Header need the following value: {"username": "", "password": ""}');
                }
                return true;
            })
        ,
        body('httpHeaders').optional()
            .custom((value, { req }) => {
                if(value.constructor.name !== 'Object'){
                    return Promise.reject('httpHeaders require  key/value pairs Object');
                }

                return true;
            })
        ,
        body('tags').optional()
            .custom((value, { req }) => {
                console.log(value.constructor.name)
                if(value.constructor.name !== 'Array'){
                    return Promise.reject('tags require  Array of strings');
                }

                return true;
            })
        ,
        body('userId')
            .notEmpty().withMessage('userId is required').bail()
            .isString().withMessage('incorrect user id').bail()
        ,
    ],
    put:[
        body('title')
            .trim()
            .isLength({ min: 5 }),
    ]
};

module.exports = checksValidators
