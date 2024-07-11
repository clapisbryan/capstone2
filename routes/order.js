const express = require("express");

const orderController = require("../controllers/order");

const router = express.Router();

const { verify, verifyAdmin } = require("../auth");

router.post("/checkout", verify, orderController.createOrder);

router.get("/my-orders", verify, orderController.getOrdersForUser);

router.get("/orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
