const express = require('express');
const { body, validationResult } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');
const usersValidators = require('../validations/users')

const router = express.Router();

router.post(
    '/signup',
    usersValidators.signUp,
    authController.signup
);

router.post('/login', authController.login);
router.get('/accountVerification/:token', authController.accountVerification);

module.exports = router;
