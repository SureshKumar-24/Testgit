const express = require("express");
const authController = require("../Controllers/authController");
const { body } = require("express-validator");
// const loginLimiter = require("../Middleware/limitMiddleware");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// login route
router.post(
  "/Signin",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required.").isNumeric().withMessage("Phone number must be numeric.").isLength({ min: 9, max: 15 }).withMessage("Please enter correct phoneNumber."),
  ],
  authController.login
);

router.post(
  "/Driver/Signin",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required.").isNumeric().withMessage("Phone number must be numeric.").isLength({ min: 9, max: 15 }).withMessage("Please enter correct phoneNumber.")
  ],
  authController.loginDriver
);

// register route
router.post(
  "/Signup",
  [
    body("phoneNumber").notEmpty().withMessage("Phone number is required.").isNumeric().withMessage("Phone number must be numeric.").isLength({ min: 9, max: 15 }).withMessage("Please enter correct phoneNumber."),
  ],
  authController.register
);

// logout route
router.post("/checkuser", authController.Checkuser);

router.post("/logout", verifyToken, authController.logout);

module.exports = router;
