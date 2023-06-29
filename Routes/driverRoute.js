const express = require("express");
const orderstatus = require('../Controllers/orderStatusController');
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

router.get("/driver/getCount", verifyToken, orderstatus.DriverOrderNoAssign);
router.get("/driver/action/accept", verifyToken, orderstatus.GetDriverOrderAccepted);
router.get("/driver/action/complete", verifyToken, orderstatus.GetDriverOrderCompleled);
router.get("/driver/action/cancel", verifyToken, orderstatus.GetDriverOrderCancelled);
router.get("/driver/action/reject", verifyToken, orderstatus.GetDriverOrderRejected);
router.get("/driver/action/all", verifyToken, orderstatus.GetDriverOrderAll);

router.post("/driver/action/accept", verifyToken, orderstatus.DriverOrderAccept);
router.post("/driver/action/pickup", verifyToken, orderstatus.DriverOrderPickup);
router.post("/driver/action/verify", verifyToken, orderstatus.DriverOrderVerify);
router.post("/driver/action/complete", verifyToken, orderstatus.DriverOrderComplete);
router.post("/driver/action/cancel", verifyToken, orderstatus.DriverOrderCancell);
router.post("/driver/action/reject", verifyToken, orderstatus.DriverOrderReject);
router.post('/Userfcmtoken', orderstatus.Userfcmtoken);


module.exports = router;
