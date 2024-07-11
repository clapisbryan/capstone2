const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const { errorHandler } = require("../auth");

module.exports.createOrder = async (req, res) => {
  let userId = req.user.id;

  // return await Cart.findOne({ userId }).populate('cartItems.productId'); // uncomment this later if a CartfineOne was error
  return await Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      } else {
        let totalPrice = 0; // initialized a total price
        const productsOrdered = []; // initialized a products ordered

        // Loop through each item in the cart
        cart.cartItems.forEach((item) => {
          // Check if the product in the cart was active
          if (item.productId.isActive) {
            // compute subtotal for each item
            const subtotal = item.quantity * item.productId.price;
            totalPrice += subtotal;

            // Add product details to productsOrdered array
            productsOrdered.push({
              productId: item.productId._id,
              quantity: item.quantity,
              subtotal: subtotal,
            });
          } else {
            // If product is not active, return error response
            return res.status(400).send({
              message: `Product '${item.productId.name}' is no longer available`,
            });
          }

          // Create new order document
          const newOrder = new Order({
            userId: userId,
            productsOrdered: productsOrdered,
            totalPrice: totalPrice,
            orderedOn: new Date(),
            status: "Pending",
          });

          return newOrder
            .save()
            .then((result) => {
              if (result) {
                Cart.findOneAndDelete({ userId }); // delete a cart wen a order was success

                // show success new order object
                return res.status(201).send({ order: newOrder });
              }
            })
            .catch((err) => errorHandler(err, req, res));
        });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.getOrdersForUser = async (req, res) => {
  let userId = req.user.id;

  return await Order.find({ userId })
    .then((orders) => {
      if (!orders || orders.length === 0) {
        return res.status(404).send({ message: "No orders found" });
      } else {
        return res.status(200).send({ orders });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.getAllOrders = async (req, res) => {
  return await Order.find()
    .then((orders) => {
      return res.status(200).send({ orders });
    })
    .catch((err) => errorHandler(err, req, res));
};
