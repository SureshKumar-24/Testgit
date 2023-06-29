const models = require("../models");
const User = models.User;
const payment = models.Payment;
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const Order = models.Order;
const Card = models.Card;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "zwigato09@gmail.com",
    pass: "htezsmllibzaorke",
  },
});
//Get all the User details
module.exports.getuser = async (req, res) => {
  try {
    const page = req.body.page;
    const limit = parseInt(req.body.limit);
    const offset = (page - 1) * limit;
    const account_type = req.body.account_type;
    const keyword = req.body.searchText;

    let blockvalue;
    if (
      keyword === "block" ||
      keyword === "bloc" ||
      keyword === "blo" ||
      keyword === "bl" ||
      keyword === "b" ||
      keyword === "Block" ||
      keyword === "Bloc" ||
      keyword === "Blo" ||
      keyword === "Bl" ||
      keyword === "B"
    ) {
      blockvalue = "0";
    }
    if (
      keyword === "unblock" ||
      keyword === "unbloc" ||
      keyword === "unbloc" ||
      keyword === "unblo" ||
      keyword === "unbl" ||
      keyword === "unb" ||
      keyword === "un" ||
      keyword === "u" ||
      keyword === "Unblock" ||
      keyword === "Unbloc" ||
      keyword === "Unbloc" ||
      keyword === "Unblo" ||
      keyword === "Unbl" ||
      keyword === "Unb" ||
      keyword === "Un" ||
      keyword === "U"
    ) {
      blockvalue = "1";
    }

    if (keyword && account_type == "2") {
      const { rows, count } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${keyword}%` } },
            { address: { [Op.like]: `%${keyword}%` } },
            { phone: { [Op.like]: `%${keyword}%` } },
            { block: { [Op.like]: `%${blockvalue}%` } },
          ],
          account_type: "2",
        },
        attributes: ["id", "name", "phone", "address", "photo_uri", "block"],
        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        success: true,
        msg: "Customer Data Successfully",
        data: rows,
        count: count,
      });
    } else {
      if (account_type == "2") {
        const { rows, count } = await User.findAndCountAll({
          where: { account_type: "2" },
          attributes: ["id", "name", "phone", "address", "photo_uri", "block"],
          offset: offset,
          limit: limit,
          order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({
          sucess: true,
          msg: "Customer Data Successfully",
          data: rows,
          count: count,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid argument" });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//Get  the one User detail
module.exports.getoneuser = async (req, res) => {
  try {
    const data = req.body.id;
    const Userdata = await User.findOne({
      where: { id: data, account_type: "2" },
    });
    if (Userdata != null) {
      return res.status(200).json({
        success: true,
        msg: "User Detail Get Successfully",
        data: Userdata,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Invalid argument",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

//Changed the block or unblock status for User and driver
module.exports.block = async (req, res) => {
  try {
    const UserId = req.body.id;
    const Usermatch = await User.findByPk(UserId);
    const block = req.body.block;
    console.log(block);
    if (block == 1) {
      await Usermatch.update({
        block: "1",
      });
      return res
        .status(200)
        .json({ success: true, msg: "User block Successfully" });
    } else {
      await Usermatch.update({
        block: "0",
      });
      return res
        .status(200)
        .json({ success: true, msg: "User Unblock Successfully" });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
//create driver api
module.exports.createDriver = async (req, res) => {
  try {
    const driverfind = await User.findOne({
      where: { phone: req.body.contact, account_type: "1" },
    });

    if (driverfind) {
      return res
        .status(403)
        .json({ success: false, msg: "Number is Already Registered" });
    } else {
      const drive = await User.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.contact,
        photo_uri: req.file.filename,
        calling_code: 91 || req.body.calling_code,
        email: req.body.email,
        account_type: "1",
        block: "0",
      });
      await transporter.sendMail({
        to: req.body.email,
        from: "Zwigato <zwigato09@gmail.com>",
        subject: "Welcome to Zwigato",
        html: `
                                 <html>
                                  <body>
                                    <p>
                                      Hi ${req.body.name},
                                      <br><br>
                                      You have successfully registered with Zwigato App. You can now log in using the provided number.
                                      <br><br>
                                      We hope you have a great journey with us.
                                      <br><br>
                                      Good luck!
                                    </p>
                                  </body>
                                </html>
                              `,
      });
      return res
        .status(201)
        .json({ success: true, msg: "Driver Added Successfully", data: drive });
    }
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

//Get all driver details
module.exports.getdriver = async (req, res) => {
  try {
    const page = req.body.page;
    const limit = parseInt(req.body.limit);
    const offset = (page - 1) * limit;
    const account_type = req.body.account_type;
    const keyword = req.body.searchText;

    let blockvalue;
    if (
      keyword === "block" ||
      keyword === "bloc" ||
      keyword === "blo" ||
      keyword === "bl" ||
      keyword === "b" ||
      keyword === "Block" ||
      keyword === "Bloc" ||
      keyword === "Blo" ||
      keyword === "Bl" ||
      keyword === "B"
    ) {
      blockvalue = "0";
    }
    if (
      keyword === "unblock" ||
      keyword === "unbloc" ||
      keyword === "unbloc" ||
      keyword === "unblo" ||
      keyword === "unbl" ||
      keyword === "unb" ||
      keyword === "un" ||
      keyword === "u" ||
      keyword === "Unblock" ||
      keyword === "Unbloc" ||
      keyword === "Unbloc" ||
      keyword === "Unblo" ||
      keyword === "Unbl" ||
      keyword === "Unb" ||
      keyword === "Un" ||
      keyword === "U"
    ) {
      blockvalue = "1";
    }

    if (keyword && account_type == "1") {
      const { rows, count } = await User.findAndCountAll({
        where: {
          [Op.or]: [
            { id: { [Op.like]: `%${keyword}%` } },
            { name: { [Op.like]: `%${keyword}%` } },
            { address: { [Op.like]: `%${keyword}%` } },
            { phone: { [Op.like]: `%${keyword}%` } },
            { block: { [Op.like]: `%${blockvalue}%` } },
          ],
          account_type: "1",
        },
        attributes: [
          "id",
          "name",
          "phone",
          "address",
          "account_type",
          "photo_uri",
          "block",
        ],
        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        success: true,
        msg: "Driver Data Successfully",
        data: rows,
        count: count,
      });
    } else {
      if (account_type == "1") {
        const { rows, count } = await User.findAndCountAll({
          where: { account_type: "1" },
          attributes: [
            "id",
            "name",
            "phone",
            "address",
            "account_type",
            "photo_uri",
            "block",
          ],
          offset: offset,
          limit: limit,
          order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({
          sucess: true,
          msg: "Driver Data Successfully",
          data: rows,
          count: count,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, msg: "Invalid argument" });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

//Get one driver detail
module.exports.getonedriver = async (req, res) => {
  try {
    const data = req.body.id;
    const Driverdata = await User.findOne({
      where: { id: data, account_type: "1" },
      attributes: [
        "id",
        "calling_code",
        "phone",
        "name",
        "email",
        "address",
        "block",
        "account_type",
        "latitude",
        "longitude",
        "photo_uri",
        "last_logged_in",
      ],
    });
    if (Driverdata != null) {
      return res.status(200).json({
        success: true,
        msg: "Driver Detail Get Successfully",
        data: Driverdata,
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: "Invalid argument",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

//Get all the order details
module.exports.getorders = async (req, res) => {
  try {
    const page = req.body.page;
    const limit = parseInt(req.body.limit);
    const offset = (page - 1) * limit;
    const searchText = req.body.searchText;

    if (searchText) {
      console.log(searchText);
      const { rows, count } = await Order.findAndCountAll({
        where: {
          [Op.or]: [
            { order_id: { [Op.like]: `%${searchText}%` } },
            { pickup_from: { [Op.like]: `%${searchText}%` } },
            { deliver_to: { [Op.like]: `%${searchText}%` } },
            { category_item_type: { [Op.like]: `%${searchText}%` } },
            { "$User.name$": { [Op.like]: `%${searchText}%` } },
            { "$User.phone$": { [Op.like]: `%${searchText}%` } },
          ],
        },
        include: [
          {
            model: User,
            attributes: ["name", "phone", "address", "photo_uri"],
            required: true,
          },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        sucess: true,
        msg: "Order Data Successfully",
        data: rows,
        count: count,
      });
    } else {
      const { rows, count } = await Order.findAndCountAll({
        include: [
          {
            model: User,
            attributes: ["name", "phone", "address", "photo_uri"],
            required: true,
          },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        sucess: true,
        msg: "Orders Data Successfully",
        data: rows,
        count: count,
      });
    }
  } catch (error) {
    res.status(500).json({ sucess: false, msg: error });
  }
};

//Get one order detail
module.exports.getoneorder = async (req, res) => {
  try {
    const data = req.body.order_id;
    const Orderdata = await Order.findOne({
      where: { order_id: data },
      include: [
        {
          model: User,
          attributes: ["name", "photo_uri"],
          required: true,
        },
        {
          model: Card,
          attributes: ["card_no", "name"],
        },
      ],
    });
    let arr = eval(Orderdata.get("category_item_type"));
    arr = JSON.parse(arr);
    let each = 0;
    arr.forEach((element) => {
      switch (true) {
        case element == "Food Item":
          each += 10;
          break;
        case element == "Medicine":
          each += 20;
          break;
        case element == "Documents or Books":
          each += 30;
          break;
        case element == "Clothes":
          each += 40;
          break;
        case element == "Electronics":
          each += 50;
          break;
        case element == "Items for Repair":
          each += 60;
          break;
        case element == "Business Deliveries":
          each += 70;
          break;
        default:
          each += 100;
          break;
      }
    });
    if (Orderdata != null) {
      return res.status(200).json({
        success: true,
        msg: "Order Detail Get Successfully",
        data: Orderdata,
        each,
      });
    }
    return res.status(400).json({ success: false, msg: "Invalid argument" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

//Get all the payment  details
module.exports.getpayment = async (req, res) => {
  try {
    const page = req.body.page;
    const limit = parseInt(req.body.limit);
    const offset = (page - 1) * limit;
    const searchText = req.body.searchText;

    let paidvalue;
    if (
      searchText === "paid" ||
      searchText === "pai" ||
      searchText === "pa" ||
      searchText === "p" ||
      searchText === "Paid" ||
      searchText === "Pai" ||
      searchText === "Pa" ||
      searchText === "P"
    ) {
      paidvalue = "1";
    }
    if (
      searchText === "unpaid" ||
      searchText === "unpai" ||
      searchText === "unpa" ||
      searchText === "unp" ||
      searchText === "un" ||
      searchText === "u" ||
      searchText === "Unpaid" ||
      searchText === "Unpai" ||
      searchText === "Unpa" ||
      searchText === "Unp" ||
      searchText === "Un" ||
      searchText === "U"
    ) {
      paidvalue = "0";
    }

    if (searchText) {
      const { rows, count } = await payment.findAndCountAll({
        where: {
          [Op.or]: [
            { "$Order.order_id$": { [Op.like]: `%${searchText}%` } },
            { "$Order.pickup_from$": { [Op.like]: `%${searchText}%` } },
            { "$Order.deliver_to$": { [Op.like]: `%${searchText}%` } },
            { "$Order.category_item_type$": { [Op.like]: `%${searchText}%` } },
            { "$Order.User.name$": { [Op.like]: `%${searchText}%` } },
            { "$Order.User.phone$": { [Op.like]: `%${searchText}%` } },
            { paid: { [Op.like]: `%${paidvalue}%` } },
          ],
        },
        include: [
          {
            model: Order,
            attributes: [
              "order_id",
              "category_item_type",
              "pickup_from",
              "deliver_to",
              "order_completed_time",
              "billing_details",
            ],
            include: [
              {
                model: User,
                attributes: ["name", "photo_uri"],
                required: true,
              },
            ],
            required: true,
          },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        sucess: true,
        msg: "Payment Data Successfully",
        data: rows,
        count: count,
      });
    } else {
      const { rows, count } = await payment.findAndCountAll({
        include: [
          {
            model: Order,
            include: [
              {
                model: User,
                attributes: ["name", "photo_uri"],
                required: true,
              },
            ],
            required: true,
          },
        ],
        offset,
        limit,
        order: [["createdAt", "DESC"]],
      });
      return res.status(200).json({
        sucess: true,
        msg: "Payment Data Successfully",
        data: rows,
        count: count,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, err: error });
  }
};

//Get one payment detail
module.exports.paymentstatus = async (req, res) => {
  try {
    const orderdata = req.body.order_id;
    const status = req.body.status;
    const paymentdata = await payment.findOne({
      where: { order_id: orderdata },
    });
    if (paymentdata.paid == 1 && status == 0) {
      const pending = await paymentdata.update({
        paid: status,
      });
      return res.status(200).json({
        success: true,
        msg: "Payment status changed to Unpaid Successfully",
        data: pending,
      });
    } else if (paymentdata.paid == 0 && status == 1) {
      const paid = await paymentdata.update({
        paid: status,
      });
      return res.status(200).json({
        success: true,
        msg: "Payment status changed to Paid Successfully",
        data: paid,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, err: error });
  }
};
