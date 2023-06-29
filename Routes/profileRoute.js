const router = require("express").Router();
const profileController = require("../Controllers/profileController");
const verifyToken = require("../Middleware/verifyToken");
const path = require('path')
const multer = require('multer');


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
const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
});
router.post("/update", verifyToken, upload.single('photo_uri'), profileController.editprofileController);

router.get("/get", verifyToken, profileController.getProfileController);


router.post("/fcmtoken", verifyToken, profileController.saveFcmTokenController);

router.post("/toggle", verifyToken, profileController.togglestatus);
module.exports = router;
