const express = require('express');
const router = express.Router();
const logincontroller = require('../Controllers/loginController');
const auth = require('../Middleware/verifyToken');
const validresult = require('../Middleware/validationresult');
// const validator = require('../Middleware/validator');

router.post('/admin/signup', logincontroller.signup);

router.post('/login', logincontroller.login);

router.post('/admin/forgot', logincontroller.forgotAdmin);

router.get('/reset-password/:token', logincontroller.ResetPassword);

router.post('/reset-password/:token', logincontroller.resetPassword);
module.exports = router;