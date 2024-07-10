const Product = require("../models/Product");
const { errorHandler } = require("../auth");

module.exports.getProducts = (req, res) => {};

module.exports.createNewProduct = (req, res) => {
  if (req.user.isAdmin) {
    // double check if a user was a admin
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isActive: req.body.isActive,
    }); // handle all data from postman request body

    // use this return to save new product data to mongoDB
    return (
      newProduct
        .save()
        // use then if new product successfully added to mongoDB
        .then((product) => {
          return res.status(201).send({
            success: true,
            message: "product successfully added",
            result: product,
          });
        })
        // use catch if there's an error while saving a new product to mongoDB
        .catch((err) => errorHandler(err, req, res))
    );
  } else {
    return res.status(403).send("Access Forbidden"); // if user wasn't admin show this return
  }
};

module.exports.retrieveAllproduct = async (req, res) => {
  return await Product.find() // use find function/method to show all products
    .then((product) => {
      if (product.length > 0) {
        // use if condition if product greather than 0
        return res.status(201).send(product);
      } else {
        // use else condition if product less than 0
        return res.status(404).send({ message: "No product found" });
      }
    })
    // use catch if there's an while finding a product
    .catch((err) => errorHandler(err, req, res));
};

module.exports.retrieveActiveproduct = async (req, res) => {
  return await Product.find({ isActive: true }) // use find function/method that will handle a isActive argument and it will find all isActive value true
    .then((product) => {
      if (product.length > 0) { // use if condition if product has a data 
        return res.status(201).send(product);
      } else {
        return res.status(404).send({ message: "No product found" }); // show this message if there's no product found
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.retrieveProductById = async (req, res) => {
  const productId = req.params.id; // this variable handle a id from postman params

  return await Product.findById(productId) // use find function/method to show specific product using id
    .then((product) => {
      if (product.length > 0) { // use if condition if product has a data 
        return res.status(201).send(product);
      } else {
        return res.status(404).send({ message: "Product not found" });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.updateProductById = async (req, res) => {
  const productId = req.params.id; // handle postman params id

  return await Product.findByIdAndUpdate(
    productId,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isActive: req.body.isActive,
    },
    { new: true }
  ) // find a product using a postman params id and then update a product data using a request body
    .then((updatedProduct) => {
      if (!updatedProduct) { // double check if updateproduct has a data if no product found use a return inside a block
        return res.status(404).send({ message: "Product not found" });
      } else {
        return res.status(201).send(updatedProduct);
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.archiveProduct = async (req, res) => {
  const productId = req.params.id; // handle a postman params id

  let updateActiveField = {
    isActive: false,
  }; // initialized a value of isActive

  await Product.findByIdAndUpdate(productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (!product.isActive) {
          return res.status(200).send({
            message: "Product already archived",
            product: product,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Product archived successfully",
        });
      } else {
        return res.status(404).send({ message: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};

module.exports.activateProduct = (req, res) => {
  const productId = req.params.id;

  let updateActiveField = {
    isActive: true,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then((product) => {
      if (product) {
        if (product.isActive) {
          return res.status(200).send({
            message: "Product already activated",
            product: product,
          });
        }
        return res.status(200).send({
          success: true,
          message: "Product activated successfully",
        });
      } else {
        return res.status(404).send({ message: "Product not found" });
      }
    })
    .catch((error) => errorHandler(error, req, res));
};
