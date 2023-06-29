const { where } = require("sequelize");
const models = require("../models");
const User_fcmtoken = models.User_fcmtoken;
const User = models.User;

const { validationResult } = require("express-validator");

//Edit profile api for driver and customer side
module.exports.editprofileController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // return res.json(req.user.id)
    if (!req.file) {
      const user = await User.update({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
      }, { where: { id: req.user.id } });
      const find = await User.findByPk(req.user.id, {
        attributes: ['name', 'address', 'email', 'phone', 'photo_uri']
      });
      return res.status(400).json({ message: 'Updae with profile photo is required', data: find })
    } else {
      const user = await User.update({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        photo_uri: req.file.filename,
      }, { where: { id: req.user.id } });
      const find = await User.findByPk(req.user.id, {
        attributes: ['name', 'address', 'email', 'phone', 'photo_uri']
      });
      return res.status(201).json({ success: true, msg: "User Updated with photo Sucessfully", data: find });
    }


  } catch (error) {
    console.error(error);
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};

//Get api for profile information 
module.exports.getProfileController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const find = await User.findOne({ where: { id: req.user.id }, attributes: ['id', 'name', 'photo_uri', 'address', 'email', 'calling_code', 'phone'] });
    return res.status(200).json({ success: true, msg: "User Data Get Sucessfully", data: find });
  } catch (error) {
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};

//Driver status api on and off for receive order notification
module.exports.togglestatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const Userdata = req.user.id;
    const statusdata = req.body.status;
    const user = await User.findOne({
      where: { id: Userdata }
    });
    if (user.status == 1 && statusdata == 0) {
      const off = await user.update({
        status: '0'
      });
      return res.status(200).json({ success: true, msg: "Driver go to Off-Line", });
    }
    else if (user.status == 0 && statusdata == 1) {
      const on = await user.update({
        status: '1'
      });
      return res.status(200).json({ success: true, msg: "Driver go to On-Line" });
    }
  } catch (error) {
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};

//Save the fcmtoken api for driver and customer 
module.exports.saveFcmTokenController = async (req, res, next) => {
  try {
    const fcmtoken = req.body.fcmtoken;
    if (fcmtoken) {
      const check = await User_fcmtoken.findOne({ where: { fcmtoken: fcmtoken, user_id: req.user.id } })
      if (!check) {
        const token = await User_fcmtoken.create({
          user_id: req.user.id,
          fcmtoken: fcmtoken,
        })
        return res.status(201).json({ success: true, msg: "User Fcmtoken Store Successfully", data: token });
      }
    }
  } catch (error) {
    return res.status(400).json({ Message: "Something Went Wrong" });
  }
};


