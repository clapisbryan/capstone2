const express = require("express");

const cartController = require("../controllers/cartss");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.patch("/cart/:productId", verify, cartController.changeProductQuantity); // Change product quantities

router.delete("/cart/:productId", verify, cartController.removeProductFromCart); // Remove a product from cart

router.delete('/cart/clear', verify, cartController.clearCart); // Clear cart

module.exports = router;
