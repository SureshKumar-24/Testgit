const db = require('../models');
const User = db.User;
const Order = db.Order;
const Notification = db.Notification;
const User_fcmtoken = db.User_fcmtoken;
const DriverAcceptReject = db.DriverAcceptReject;
const { Sequelize, Op } = require('sequelize');
const moment = require('moment');

//Use the firebase admin initialize 
var admin = require("firebase-admin"); var serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// //When the order has been not to assign anyone and driver pick in the five kilometer
module.exports.DriverOrderNoAssign = async (req, res) => {
    try {
        const rejectorderandcancel = await DriverAcceptReject.findAll({
            where: { driver_id: req.user.id, driver_order_status: [3, 4] },
            attributes: ['order_id']
        });

        ids = rejectorderandcancel.map((obj) => {
            return obj.order_id;
        });


        const { count, rows } = await Order.findAndCountAll({
            where: { order_assign: "0", order_status: "0", order_id: { [Op.notIn]: ids } },
            include: [{
                model: User,
                required: true,
                attributes: ['phone', 'name', 'photo_uri']
            }],
            order: [["createdAt", "DESC"]]
        });
        const Till = moment().format("DD MMMM, YYYY");
        const orderTill = ` ${Till}`;
        return res.json({ success: true, msg: "Order still not assign other driver", Till: orderTill, count: count, data: rows })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

//Driver Accept the Order 
module.exports.DriverOrderAccept = async (req, res) => {
    try {
        console.log(req.body.status);
        const Order_Id = req.body.Order_Id || req.body.order_id;
        if (!Order_Id) {
            return res.status(400).json({ msg: "order not be null" });
        }
        // const Driver_Id = req.user.id;
        const order = await Order.findOne({
            where: { order_id: Order_Id }
        })
        const orderAssign = await Order.findOne({
            where: { order_id: Order_Id, driver_id: "0", order_assign: "0" }
        });
        //Check the order is assigned to order person or not
        const orderaccept = await Order.findOne({
            where: { driver_id: req.user.id, order_status: "1", order_assign: "1" }
        });

        //pin generate for verification 



        if (orderaccept) {
            return res.json({ msg: "You are a pending order still uncomplete" });
        } else {
            if (orderAssign == null) {
                return res.json({ msg: "Order is Already Assigned", value: "1" });
            } else {
                await orderAssign.update({
                    driver_id: req.user.id,
                    order_assign: "1",
                    order_status: "1"
                });
                await DriverAcceptReject.create({
                    order_id: Order_Id,
                    driver_id: req.user.id,
                    driver_order_status: "1"
                })
            }
        }
        //Find the fcmtoken and send the order confirmed message Successfully
        const fcm_tokens = await User_fcmtoken.findAll({
            where: { user_id: order.user_id },
            attributes: ['fcmtoken']
        });
        console.log(fcm_tokens);
        fcm_tokens.forEach(user => {
            let message = {
                notification: {
                    title: "Order Accepted", body: `Your order #${order.order_id} has been accepted by the driver. They will be on their way soon`,
                },
                token: user.dataValues.fcmtoken
            };
            admin.messaging().send(message).then(async (msg) => {
                await Notification.create({ user_id: order.user_id, text: message.notification.body });
            });
        });

        return res.status(200).json({ success: true, msg: "Order Confirmed Successfully", data: order });
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//Driver pick up status update then user side the driver location start from the pick_from to deliver_to show
module.exports.DriverOrderPickup = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id || req.body.order_id;
        if (!Order_Id) {
            return res.status(400).json({ msg: "order not be null" });
        }
        //order pickup status changes from 0 to 1 successfully
        const pickup = await Order.update({
            pickup_status: 1,
        }, { where: { order_id: Order_Id, pickup_status: 0, driver_id: req.user.id } });

        //find the order details
        const order = await Order.findOne({
            where: { order_id: Order_Id }
        });
        if (order) {
            //Find the fcmtoken and send the order confirmed message Successfully
            const fcm_tokens = await User_fcmtoken.findAll({
                where: { user_id: order.user_id },
                attributes: ['fcmtoken']
            });
            fcm_tokens.forEach(user => {
                let message = {
                    notification: {
                        title: "Order Pickup", body: `You Order #${order.order_id} has pick-up Successfully`,
                    },
                    token: user.dataValues.fcmtoken
                };
                admin.messaging().send(message).then(async (msg) => {
                    await Notification.create({ user_id: order.user_id, text: message.notification.body });
                });
            });
            return res.status(200).json({ success: true, msg: "Order pickup Successfully" });
        } else {
            return res.status(400).json({ success: false, msg: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//Order verify pin after that the driver show the complete button it request for the user for pin to call him 
module.exports.DriverOrderVerify = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id || req.body.order_id;
        const pin = req.body.pin;

        //find the order details
        const order = await Order.findOne({
            where: { order_id: Order_Id, driver_id: req.user.id }
        })
        if (order) {
            if (order.order_pin == pin) {
                return res.status(200).json({ success: true, msg: "Verify pin successfully you can complete order" });
            } else {
                return res.status(200).json({ success: false, msg: "Invalid Pin" });
            }
        } else {
            return res.status(400).json({ success: false, msg: "Wrong order_id or driver_id" });
        }


    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//When the driver complete the orders
module.exports.DriverOrderComplete = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id || req.body.order_id;

        if (!Order_Id) {
            return res.status(400).json({ msg: "order not be null" });
        }
        const OrderComplete = await Order.findOne({
            where: { order_id: Order_Id, pickup_status: 1 }
        });

        const complete_time = moment().format("DD MMMM YYYY, hh:mm A");;
        await OrderComplete.update({
            order_completed_time: complete_time,
            order_status: "2"
        })

        const checkdriver = await DriverAcceptReject.findOne({
            where: { order_id: Order_Id, driver_order_status: 1 }
        })
        console.log(checkdriver);
        await checkdriver.update({
            driver_order_status: "2"
        })
        //Find the fcmtoken regarding the order 
        const order = await Order.findOne({
            where: { order_id: Order_Id }
        })
        //User side notification

        const fcm_tokens = await User_fcmtoken.findAll({
            where: { user_id: order.user_id },
            attributes: ['fcmtoken']
        });
        fcm_tokens.forEach(user => {
            let message = {
                notification: {
                    title: "Order Completed", body: `Your order #${order.order_id} has been successfully delivered. Thank you for using our service!`,
                }, token: user.dataValues.fcmtoken
            };
            admin.messaging().send(message).then(async (msg) => {
                await Notification.create({ user_id: order.user_id, text: message.notification.body });
            });;
        })
        //Driver side send notification
        const fcm_token = await User_fcmtoken.findAll({
            where: { user_id: req.user.id },
            attributes: ['fcmtoken']
        });
        console.log(fcm_tokens);
        fcm_token.forEach(user => {
            let message = {
                notification: {
                    title: "Order Completed", body: `You have Completed Order ${Order_Id} Successfully`,
                },
                token: user.dataValues.fcmtoken
            };
            admin.messaging().send(message).then(async (msg) => {
                await Notification.create({ user_id: req.user.id, text: message.notification.body });
            });
        });
        res.json({ success: true, msg: "Order Completed Successfully", data: OrderComplete });

    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//Order if driver accept then the cancell order option
module.exports.DriverOrderCancell = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id || req.body.order_id;
        if (!Order_Id) {
            return res.status(400).json({ msg: "order not be null" });
        }
        // const Driver_Id = req.user.id;

        const accept = await DriverAcceptReject.findOne({
            where: { order_id: Order_Id, driver_order_status: 1 }
        });

        const cancelled = await accept.update({
            driver_order_status: 3
        });

        const OrderDriverStatus = await Order.findOne({
            where: { order_id: Order_Id },
            attributes: ['driver_id', 'order_status', 'order_assign', 'id']
        })
        console.log(OrderDriverStatus);

        const updateOrder = await OrderDriverStatus.update({ driver_id: "0", order_status: "0", order_assign: "0" });
        //Find the fcmtoken regarding the order 
        const order = await Order.findOne({
            where: { order_id: Order_Id }
        })
        const fcm_tokens = await User_fcmtoken.findAll({
            where: { user_id: order.user_id },
            attributes: ['fcmtoken']
        });
        fcm_tokens.forEach(user => {
            let message = {
                notification: {
                    title: "Order Canceled", body: `The driver has canceled the order #${order.order_id}`,
                }, token: user.dataValues.fcmtoken
            };
            admin.messaging().send(message).then(async (msg) => {
                await Notification.create({ user_id: order.user_id, text: message.notification.body });
            });;
        })


        return res.json({ success: true, msg: "Order Cancelled Sucessfully", data: cancelled });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Driver reject the order
module.exports.DriverOrderReject = async (req, res) => {
    try {
        const Order_Id = req.body.Order_Id || req.body.order_id
        // const Driver_Id = req.user.id;
        if (!Order_Id) {
            return res.status(400).json({ msg: "order not be null" });
        }

        const reject = await DriverAcceptReject.create({
            order_id: Order_Id,
            driver_id: req.user.id,
            driver_order_status: "4"
        })
        res.json({ msg: reject, msg: "Order rejected Successfully", data: reject });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Get Api for driver side
module.exports.GetDriverOrderAll = async (req, res) => {
    try {

        const accepted = await DriverAcceptReject.findAll({
            where: { driver_id: req.user.id, driver_order_status: [1, 2, 3, 4] },
            include: [{
                model: Order,
                include: [{
                    model: User,
                    required: true,
                    attributes: ['name', 'phone', 'photo_uri']
                }],
                required: true
            }],
            order: [["updatedAt", "DESC"]]
        })
        res.status(200).json({ success: true, msg: "Driver Get All Type Order Data", data: accepted });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Driver get all rejected order api
module.exports.GetDriverOrderAccepted = async (req, res) => {
    try {

        const accepted = await DriverAcceptReject.findAll({
            where: { driver_id: req.user.id, driver_order_status: 1 },
            include: [{
                model: Order,
                include: [{
                    model: User,
                    required: true,
                    attributes: ['name', 'photo_uri', 'phone']
                }],
                required: true
            }],
            order: [["updatedAt", "DESC"]]
        })
        res.json({ success: true, msg: "Order Accepted By Driver Data", data: accepted });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Driver get all Complete  order  api
module.exports.GetDriverOrderCompleled = async (req, res) => {
    try {

        const Completed = await DriverAcceptReject.findAll({
            where: { driver_id: req.user.id, driver_order_status: 2 },
            include: [{
                model: Order,
                include: [{
                    model: User,
                    required: true,
                    attributes: ['name', 'phone', 'photo_uri']
                }],
                required: true
            }],
            order: [["updatedAt", "DESC"]]
        })
        res.status(200).json({ success: true, msg: "Driver Order Completed Get Successfully", data: Completed });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Driver get all cancelled  order by him api
module.exports.GetDriverOrderCancelled = async (req, res) => {
    try {

        const cancelled = await DriverAcceptReject.findAll({
            where: { driver_id: req.user.id, driver_order_status: 3 },
            include: [{
                model: Order,
                include: [{
                    model: User,
                    required: true,
                    attributes: ['name', 'phone', 'photo_uri']
                }],
                required: true
            }],
            order: [["updatedAt", "DESC"]]
        })
        return res.json({ success: true, msg: "Driver Order Cancelled get Successfully", data: cancelled });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

//Driver get all rejected order by him api
module.exports.GetDriverOrderRejected = async (req, res) => {
    try {
        const reject = await DriverAcceptReject.findAll({
            where: { driver_id: req.user.id, driver_order_status: 4 },
            include: [{
                model: Order,
                include: [{
                    model: User,
                    required: true,
                    attributes: ['name', 'photo_uri', 'phone']
                }],
                required: true,
            }],
            order: [["updatedAt", "DESC"]]
        })
        return res.json({ success: true, msg: "Order rejected data", data: reject });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports.Userfcmtoken = async (req, res) => {
    try {
        const { user_id, fcmtoken } = req.body;
        const Usertoken = await User_fcmtoken.create({
            user_id: user_id,
            fcmtoken: fcmtoken,
        })
        return res.json({ success: true, msg: "Your fcmtoken saved Successfully", data: Usertoken });
    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}




