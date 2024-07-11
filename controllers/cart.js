const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

module.exports.getCartItems = (req, res) => {
	console.log("req.user.id", req.user.id);
	return Cart.find({ id: req.user.id })
	.then( cart => {
		if(!cart) {
			return res.status(404).send({ message: "User Not Found"})
		} 
		return res.status(200).send({ items: cart.cartItems})
	})
	.catch((err) => errorHandler(err, req, res))
}

module.exports.addToCart = (req, res) => {
	console.log("req.user.id", req.user.id);
	return Cart.findOne({id: req.user.id})
	.then(cart => {
		console.log("Item of cart", cart);
		if(!cart ) {
			if(cart.cartItems.length === 0) {
			let newItem = new Cart({
				userId: req.user.id,
				cartItems : req.body.cartItems,
				totalPrice: req.body.totalPrice
			});
			console.log(newItem);
			return newItem.save()
			.then(item => {
				return res.status(201).send({
					success: true,
					message: 'Item added to cart successfully'
				});
			})
			.catch(error => errorHandler(error, req, res));
			} 
		} else {
			let totalPrice = 0;
			cart.cartItems.forEach((item) => {
				console.log("item:", item);
			})
		}
		

	})
	.catch((err) => errorHandler(err, req, res))
}

module.exports.changeProductQuantity = async (req, res) => {
  const userId = req.user.id; // get id of authenticated user

  const productId = req.params.productId; // get id of postman params
  const quantity = req.body.quantity; // get a quantity of postman

  return await Cart.findOne({ userId }) // use find function/method to find a vart of
  .then((cart) => {
  	if (cart.length > 0) {
        // use if condition that will handle a cart length
  		return cart.cartItems
          .find((item) => item.productId === productId) // check if a product was already on cart
          .then((cartItem) => {
          	if (cartItem.length > 0) {
              // use if condition to check if cartItem has a data
              cartItem.quantity = quantity; // add request body quantity to cartItem.quantity
              cartItem.subtotal = cartItem.quantity * cartItem.price; // compute a subtotal using a cart quantity and price

              // Recalculate a cart total price
              cart.totalPrice = cart.cartItems.reduce(
              	(total, item) => total + item.subtotal,
              	0
              	);
              return cart
                .save() // save new cart items to mongoDB
                .then(() => res.status(200).send({ cart })) // show a success response
                .catch((err) => errorHandler(err, req, res)); // show error message if there's an error while saving cart item to mongoDB
            } else {
              // return message if there's no product found
            	return res
            	.status(404)
            	.send({ message: "Product not found in cart" });
            }
        });
      } else {
        // return message if there's no cart found
      	return res.status(404).send({ message: "Cart not found" });
      }
  })
    // show error message if there's an error while searching a user cart
  .catch((err) => errorHandler(err, req, res));
};

module.exports.removeProductFromCart = async (req, res) => {
  const userId = req.user.id; // get a authenticated user

  const productId = req.params.productId; // get a product id using postman params

  return await Cart.findOne({ userId }) // used findOne function/method to find a user cart
    .then((cart) => { // this argument will handle a cart data
      if (cart.length > 0) { // this will handle a condition if a cart has a data
      	const cartItemIndex = cart.cartItems.findIndex(
      		(item) => item.productId === productId
        ); // check if a product from post params was already in cartItems

        if (cartItemIndex === -1) { // use if condition cartItemIndex has negative value or empty
        	return res.status(404).send({ message: "Product not found in cart" });
        } else {
          cart.cartItems.splice(cartItemIndex, 1); // clear cart

          // Recompute a total price
          cart.totalPrice = cart.cartItems.reduce(
          	(total, item) => total + item.subtotal,
          	0
          	);

          return cart
            .save() // save new product cart
            .then((result) => res.status(200).send({ cart })) // show current cart 
            .catch((err) => errorHandler(err, req, res));
        }
    } else {
        // return message if a cart doesn't have a data
    	return res.status(404).send({ message: "Cart not found" });
    }
})
    .catch((err) => errorHandler(err, req, res));
};

module.exports.clearCart = async (req, res) => {
  const userId = req.user.id; // get id of authenticated user

  return await Cart.findOne({ userId }) 
  .then((cart) => {
  	if (cart.length > 0) {
  		cart.cartItems = [];

  		cart.totalPrice = 0;

  		return cart
  		.save()
  		.then((result) =>
  			res.status(200).send({ message: "Cart cleared successfully" })
  			)
  		.catch((err) => errorHandler(err, req, res));
  	} else {
  		return res.status(404).send({ message: "Cart not found" });
  	}
  })
  .catch((err) => errorHandler(err, req, res));
};
