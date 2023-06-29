const rateLimit = require("express-rate-limit");

// create a rate limiter for login or signup attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 5 requests per windowMs
  message: "Too many login or signup attempts from this IP, please try again after 15 minutes"
});

module.exports= loginLimiter;