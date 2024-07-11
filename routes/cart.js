const express = require("express");

const cartController = require("../controllers/cart");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.get("/get-cart", verify, cartController.getCartItems);

router.post("/add-to-cart", verify, cartController.addToCart);

router.patch("/update-cart-quantity", verify, cartController.updateProductQuantity);

router.delete("/remove-from-cart", cartController.removeFromCart);

router.delete("/clear-cart", cartController.clearCart);

module.exports = router;