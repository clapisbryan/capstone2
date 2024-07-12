const Order = require("../models/Order");
const { errorHandler } = require("../auth");

module.exports.retrieveAllOrder = (req, res) => {
	return Order.find({})
	.then((order) => {
		if(!order) {
			return res.status(404).send({ message: "No Orders Found"})
		} else {
			return res.status(200).send({ orders: order})
		}
	})
}

module.exports.retrieveMyOrder = (req, res) => {

	return Order.findOne({ userId : req.user.id })
	.then((order) => {
		if(!order) {
			return res.status(404).send({ message: "No Orders Found"})
		} else {
			return res.status(200).send({ orders: order})
		}
	})
	.catch((err) => errorHandler(err, req, res))
}