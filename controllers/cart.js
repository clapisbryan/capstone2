const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

module.exports.getCartItems = (req, res) => {
  console.log("req.user.id", req.user.id);
  return Cart.findOne({ userId: req.user.id })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: "User Not Found" });
      }
      return res.status(200).send({ items: cart.cartItems });
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.addToCart = async (req, res) => {
  const userId = req.user.id; // get id of authenticated user
  const { cartItems, totalPrice } = req.body;

  return await Cart.findOne({ userId: userId }) // find a cart of user
    .then((cart) => {
      // If cart does not exist, create a new one
      if (!cart) {
        let newCart = new Cart({
          userId: userId,
          cartItems: cartItems,
          totalPrice: totalPrice,
        });

        return newCart
          .save()
          .then((item) => {
            return res.status(201).send({
              message: "Item added to cart successfully",
              cart: item,
            });
          })
          .catch((error) => errorHandler(error, req, res));
      } else {
        // Cart exists, merge cartItems and update totalPrice
        cartItems.forEach((newItem) => {
          let existingItem = cart.cartItems.find(
            (item) => item.productId === newItem.productId
          );
          if (existingItem) {
            // Update existing item
            existingItem.quantity += newItem.quantity;
            existingItem.subtotal += newItem.subtotal;
          } else {
            // Add new item to cartItems
            cart.cartItems.push(newItem);
          }
        });

        // Update totalPrice
        cart.totalPrice += totalPrice;

        // Save updated cart
        return cart
          .save()
          .then((savedCart) => {
            return res.status(200).send({
              message: "Item added to cart successfully",
              cart: savedCart,
            });
          })
          .catch((error) => errorHandler(error, req, res));
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.changeProductQuantity = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { cartItems, totalPrice } = req.body;
    if (!Array.isArray(cartItems) || totalPrice == null) {
      return res.status(400).send({
        message:
          "Invalid data format: cartItems should be an array and totalPrice is required",
      });
    }

    const totalPriceFloat = parseFloat(totalPrice);
    if (isNaN(totalPriceFloat)) {
      return res.status(400).send({ message: "Invalid totalPrice value" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).send({ message: "Cart not found" });
    }

    let newTotalPrice = 0;

    const itemMap = new Map();
    cart.cartItems.forEach((item) => itemMap.set(item.productId, item));

    cartItems.forEach((newItem) => {
      const { productId, quantity, subtotal } = newItem;

      if (!productId || quantity == null || subtotal == null) {
        throw new Error(
          "Invalid cart item data: productId, quantity, and subtotal are required"
        );
      }

      const quantityInt = parseInt(quantity, 10);
      const subtotalFloat = parseFloat(subtotal);

      if (isNaN(quantityInt) || isNaN(subtotalFloat)) {
        throw new Error("Invalid quantity or subtotal value");
      } // Check if the item already exists in the cart
      if (itemMap.has(productId)) {
        // Update existing item
        const item = itemMap.get(productId);
        item.quantity += quantityInt;
        item.subtotal += subtotalFloat;
      } else {
        // Add new item to cart
        cart.cartItems.push({
          productId,
          quantity: quantityInt,
          subtotal: subtotalFloat,
        });
      }
    });

    // Calculate the new totalPrice
    cart.cartItems.forEach((item) => {
      newTotalPrice += item.subtotal;
    });

    // Update cart's totalPrice
    cart.totalPrice = newTotalPrice;

    // Save the updated cart
    await cart.save();

    return res.status(200).send({
      message: "Cart updated successfully",
      updatedCart: cart,
    });
  } catch (error) {
    console.error("Error in changeProductQuantity:", error);
    errorHandler(error, req, res);
  }
};

module.exports.removeProductFromCart = (req, res) => {
  const { productId } = req.params;

  // Find the cart for the user
  Cart.findOne({ userId: req.user.id })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({
          message: "Cart not found",
        });
      }

      // Find index of cartItem to remove
      const indexToRemove = cart.cartItems.findIndex(
        (item) => item.productId === productId
      );

      if (indexToRemove === -1) {
        return res.status(404).json({
          message: `Product with ID ${productId} not found in cart`,
        });
      }

      // Calculate the subtotal of the item being removed
      const removedItemSubtotal = cart.cartItems[indexToRemove].subtotal;

      // Remove item from cartItems array
      cart.cartItems.splice(indexToRemove, 1);

      // Update totalPrice for the cart
      cart.totalPrice -= removedItemSubtotal;

      // Save updated cart
      return cart
        .save()
        .then((savedCart) => {
          return res.status(200).send({
            message: `Product with ID ${productId} removed from cart successfully`,
          });
        })
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.clearCart = (req, res) => {
  // Find the cart for the user
  Cart.findOne({ userId: req.user.id })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({
          message: "Cart not found",
        });
      }

      // Clear cartItems array
      cart.cartItems = [];

      // Reset totalPrice
      cart.totalPrice = 0;

      // Save updated cart
      return cart
        .save()
        .then((savedCart) => {
          return res.status(200).send({
            message: "Cart cleared successfully",
          });
        })
        .catch((error) => errorHandler(error, req, res));
    })
    .catch((err) => errorHandler(err, req, res));
};
