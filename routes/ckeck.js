const express = require('express');
const { body, validationResult } = require('express-validator')
const checkController = require('../controllers/check');
const isAuth = require('../middleware/is-auth');
const checkValidators = require('../validations/Checks')

const router = express.Router();

// GET /feed/posts
router.get('/',checkController.getChecks);

// POST /feed/post
router.post(
    '/',
    checkValidators.post,
    checkController.createCheck
);

router.get('/check/:checkId', checkController.getCheck);

router.put(
    '/:checkId',
    checkValidators.put,
    checkController.updateCheck
);

router.delete('/:checkId', checkController.deleteCheck);

//Command
router.patch('/:checkId/listen-status',checkController.updateListenStatus)

//Reports
router.patch('/:checkId/reports',checkController.updateListenStatus)
router.patch('/:checkId/reports/:reportId',checkController.updateListenStatus)

module.exports = router;
