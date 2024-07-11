const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

module.exports.getCartItems = (req, res) => {
	return Cart.find({ id: req.user.id })
	console.log("req.user.id", req.user.id);
	.then( item => {
		if(!item) {
			return res.status(404).send({ message: "User Not Found"})
		} 
		return res.status(200).send({ items: item.cartItems})
	})
	.catch((err) => errorHandler(err, req, res))
}

module.exports.addToCart = (req, res) => {
	let newItem = new Cart({
		userId: req.user.id,
        cartItems : req.body.cartItems,
        totalPrice: req.body.totalPrice
    });
    return newItem.save()
	.then(item => {
	        // if the user successfully enrolled,return true and send a message 'Enrolled successfully'.
		return res.status(201).send({
			success: true,
			message: 'Item added to cart'
		});
	})
	.catch(error => errorHandler(error, req, res));
}

module.exports.updateProductQuantity = (req, res) => {
	
}

module.exports.removeFromCart = (req, res) => {
	
}

module.exports.clearCart = (req, res) => {
	
}