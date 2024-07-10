const express = require("express");

const cartController = require("../controllers/cart");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.get("/:userId/cartItems", cartController.getCartItems);

router.post("/addToCart", cartController.addToCart);

router.patch("/updateQuantity", cartController.updateProductQuantity);

router.delete("/removeFromCart", cartController.removeFromCart);

router.delete("/clearCart", cartController.clearCart);

module.exports = router;