const Product = require("../models/Product");
const { errorHandler } = require("../auth");

module.exports.getProducts = (req, res) => {};

module.exports.createNewProduct = (req, res) => {
  if (req.user.isAdmin) {
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isActive: req.body.isActive,
    });

    return newProduct
      .save()
      .then((product) => {
        return res.status(201).send({
          success: true,
          message: "product successfully added",
          result: product,
        });
      })
      .catch((err) => errorHandler(err, req, res));
  } else {
    return res.status(403).send("Access Forbidden");
  }
};

module.exports.retrieveAllproduct = async (req, res) => {
  return await Product.find()
    .then((product) => {
      if (product.length > 0) {
        return res.status(201).send(product);
      } else {
        return res.status(404).send({ message: "No product found" });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.retrieveActiveproduct = async (req, res) => {
  return await Product.find({ isActive: true })
    .then((product) => {
      if (product.length > 0) {
        return res.status(201).send(product);
      } else {
        return res.status(404).send({ message: "No product found" });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.retrieveProductById = async (req, res) => {
  const productId = req.params.id;

  return await Product.findById(productId)
    .then((product) => {
      if (product.length > 0) {
        return res.status(201).send(product);
      } else {
        return res.status(404).send({ message: "Product not found" });
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.updateProductById = async (req, res) => {
  const productId = req.params.id;

  return await Product.findByIdAndUpdate(
    productId,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      isActive: req.body.isActive,
    },
    { new: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(404).send({ message: "Product not found" });
      } else {
        return res.status(201).send(updatedProduct);
      }
    })
    .catch((err) => errorHandler(err, req, res));
};

module.exports.archiveProduct = async (req, res) => {
  const productId = req.params.id;

  let updateActiveField = {
    isActive: false,
  };

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
