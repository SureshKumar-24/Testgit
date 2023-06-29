const models = require("../models");
const User = models.User;
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // console.log(decoded.id, req.user.account_type);
    const user = await User.findByPk(decoded.id);
    // console.log(user);
    if (!user || !user.tokens) {
      return res.status(401).json({ message: "Please Signin to access this Page" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;
