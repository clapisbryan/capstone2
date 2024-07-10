const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "User ID is required"]
	},
	productsOrdered: [
		{
			productId: {
				type: String,
				required: [true, "Product ID is required"]
			}
		},
		{
			quantity: {
				type: Number,
				required: [true, "Quantity is required"]
			}
		},
		{
			subtotal: {
				type: Number,
				required: [true, "Subtotal is required"]
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, "Total Price is required"]
	},
	orderedOn: {
		// allows us to use the date/time format
		type: Date,
		// now property of the Date object will get the current date/time that is registered on your device
	default: Date.now
	},
	status: {
		type: String,
		default: "Pending"
	}
})

module.exports = mongoose.model('Order', orderSchema);