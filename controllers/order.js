const Order = require("../models/Order");
const { errorHandler } = require("../auth");

module.exports.createOrder = async (req, res) => {
  const { userId, productsOrdered, totalPrice } = req.body;

  if (!userId || !productsOrdered || !totalPrice) {
    return res.status(400).send({
      message: "UserId, productsOrdered, and totalPrice are required",
    });
  }

  if (productsOrdered.length === 0) {
    return res.status(400).send({ message: "No items to checkout" });
  }

  return await Order.findOne({ userId: userId })
    .then((orderExist) => {
      if (orderExist) {
        return res.status(400).send({ message: "Order already exist" });
      } else {
        const newOrder = new Order({
          userId: userId,
          productsOrdered: productsOrdered,
          totalPrice: totalPrice,
        });

        return newOrder
          .save()
          .then((result) =>
            res.status(201).send({
              message: "Ordered successfully",
            })
          )
          .catch((err) => errorHandler(err, req, res));
      }
    })
    .catch((err) => errorHandler(err, req, res));
};
module.exports.retrieveAllOrder = (req, res) => {
  return Order.find({}).then((order) => {
    if (!order) {
      return res.status(404).send({ message: "No Orders Found" });
    } else {
      return res.status(200).send({ orders: order });
    }
  });
};

module.exports.retrieveMyOrder = (req, res) => {
  return Order.findOne({ userId: req.user.id })
    .then((order) => {
      if (!order) {
        return res.status(404).send({ message: "No Orders Found" });
      } else {
        return res.status(200).send({ orders: order });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};
