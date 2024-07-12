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
