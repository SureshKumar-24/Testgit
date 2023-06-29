const express = require("express");
const path = require('path');
require('dotenv').config();
// require('dotenv').config({ path: path.join(__dirname, './env') });

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cron = require("cron");

const deleteUserData = require("./deleteUserData");

var db = require('./models');

const authRoute = require("./Routes/authRoute");
const orderRoute = require("./Routes/orderListRoute");
const driverRoute = require("./Routes/driverRoute");
const profileRoute = require('./Routes/profileRoute');
const paymentRoute = require("./Routes/payment");
const feedbackRoute = require("./Routes/feedback");
const notificationRoute = require("./Routes/notification");
const loginroute = require('./Routes/loginroute');
const customeroute = require('./Routes/customerroute');


const app = express();

app.use('/', express.static(path.join(__dirname, 'Image')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use("/auth", authRoute);
app.use(orderRoute);
app.use(driverRoute);
app.use(profileRoute);
app.use(paymentRoute);
app.use(feedbackRoute);
app.use(notificationRoute);
app.use(loginroute);
app.use(customeroute);

const PORT = process.env.PORT || 3000;
app.listen(PORT);



// Setup cron job to delete user data
const cronJob = new cron.CronJob(
  "37 11 * * *", // Run every day at 11:15 AM according to India time standard
  async () => {
    await deleteUserData(); // Call function to delete user data
  },
  null,
  true,
  "Asia/Kolkata" // Set timezone to India Standard Time
);
// Start the cron job
cronJob.start();
// const regex = /^[bu]/i;
// const keyword1 = "";
// console.log(typeof(regex.test(keyword1)));

module.exports = app;
