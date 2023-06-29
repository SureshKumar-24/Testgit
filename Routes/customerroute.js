const express = require('express');
const router = express.Router();
const path = require('path')
const multer = require('multer');

const customeroute = require("../Controllers/CustomerController");

const auth = require('../Middleware/verifyToken');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, '../Image');
        cb(null, path.join(__dirname, '../Image'));
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });


router.post('/getcustomer', auth, customeroute.getuser);
router.post('/user/detail', auth, customeroute.getoneuser);
router.post('/block', auth, customeroute.block);
router.post('/driver/signup', auth, upload.single('photo_uri'), customeroute.createDriver);
router.post('/getdriver', auth, customeroute.getdriver);
router.post('/driver/detail', auth, customeroute.getonedriver);
router.post('/getorder', auth, customeroute.getorders);
router.post('/order/detail', auth, customeroute.getoneorder);
router.post('/getpayment', auth, customeroute.getpayment);
router.post('/payment/status', auth, customeroute.paymentstatus);

module.exports = router;

