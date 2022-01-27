const { body, validationResult } = require('express-validator');
const User = require('../models/user');

let authenticationValidators = {
    signUp: [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    login: [
        body("email", "email must be provided")
            .normalizeEmail()
            .isEmail()
            .custom((value) =>
                Users.findOne({ email: value }).then((user) => {
                    if (!user) return Promise.reject("Incorrect email or password");
                })
            )
    ]
};

module.exports = authenticationValidators
