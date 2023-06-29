const { check, body } = require('express-validator');
const model = require('../models');
const cutomerr = model.Customer;
const user = model.User;

exports.registervalid = [body('password')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long'),]


exports.loginvalidation = [check("email").isEmail().withMessage("enter the valid email"), check("password").not().isEmpty().withMessage("the password is required"),];
exports.resetpassvalid = [body('password')
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long'),]

exports.customervalidation = [body("contact").isLength({ min: 10 }).withMessage("enter the valid mobile number")];