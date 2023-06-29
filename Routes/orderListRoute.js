const express = require("express");

// Import controller functions for each route
const orderListController = require("../Controllers/orderListController");

// Import middleware to verify JWT token
const verifyToken = require("../Middleware/verifyToken");

const router = express.Router();

// Add Task Detail
router.post("/task", verifyToken, orderListController.addtask);
router.get('/taskdetails', verifyToken, orderListController.getask);

// Route to get all orders
router.get("/orders/:status", verifyToken, orderListController.getOrdersByStatus);
router.get("/orders/pickup/:order_id", verifyToken, orderListController.getPickstatus);
// Route to cancel an order by ID
router.post("/orders/cancel", verifyToken, orderListController.cancelOrder);

//Add Catergory 
router.post("/Order/Category", verifyToken, orderListController.AddCategory)
router.get("/Order/Category", orderListController.getCategory);

module.exports = router;
