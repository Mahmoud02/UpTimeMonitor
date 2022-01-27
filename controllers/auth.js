const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const emailSender = require('../helpers/mail')
const config = require("../config");
const crypto = require('crypto');
const  userRepo = require('../repos/userRepo')

const User = require('../models/user');
const Token = require('../models/token');
const sendEmail = require('../Notification/mail.queue').sendEmail;


exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            return userRepo.insert({
                email:email,
                password:hashedPw,
                name:name
            })
        })
        .then(user => {
            // Create a verification token for this user
            let token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
            // Save the verification token
            token.save();
            let data ={
                user:{
                    name:name,
                    email:email
                },
                msg:'Hello,Please verify your account by clicking the link: http://'+ req.headers.host +'/auth/accountVerification/'+ token.token + ' .',
                tittle:'Confirm Your Account'
                }
            sendEmail(data)
            res.status(201).json({ message: 'User created!,check email to confirm your account', userId: user._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            if (!loadedUser.isVerified)
                return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });

            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                config.Sign_key,
                { expiresIn: '1h' }
            );
            res.status(200).json({ token: token, userId: loadedUser._id.toString() });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
exports.accountVerification = (req, res, next) => {
    let token = req.params.token;
    // Find a matching token
    Token.findOne({ token: token }, function (err, token) {
        if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });

        // If we found a token, find a matching user
        User.findOne({ _id: token._userId}, function (err, user) {
            if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

            // Verify and save the user
            user.isVerified = true;
            user.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send("The account has been verified. Please log in.");
            });
        });
    });
};
