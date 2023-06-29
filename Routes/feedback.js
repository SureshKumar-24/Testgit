const express = require("express");
const feedBackController = require("../Controllers/feedback.js");
const { body } = require("express-validator");
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();


// router.get("/feedback/list_feedbacks", verifyToken, feedBackController.listFeedbacks);
router.get("/feedback/user_feedback", verifyToken, feedBackController.UserlistFeedbacks);
router.get("/feedback/driver_feedback", verifyToken, feedBackController.DriverlistFeedbacks);

router.get("/feedback/driver_feedback/:order_id", verifyToken, feedBackController.driverFeedback);

router.post(
  "/feedback/save", [verifyToken, body("stars").isInt({ min: 1, max: 5 }), body("comment").isString()],
  feedBackController.feedBack
);


module.exports = router;