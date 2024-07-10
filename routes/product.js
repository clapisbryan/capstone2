const express = require("express");

const productController = require("../controller/product");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/products", verify, verifyAdmin, productController.getProducts); // Create New Product (admin only)
router.get("/products", productController.retrieveAllproduct); // Retrieves all products.
router.get("/products/active", productController.retrieveActiveproduct); // Retrieves active products.
router.get("/products/:id", verify, productController.retrieveProductById); // Retrieves a single product by ID
router.put("/products/:id", verify, verifyAdmin, productController.updateProductById); // Updates a product by ID (admin only)
router.put("/products/:id/archive", verify, verifyAdmin, productController.archiveProduct); // Archives a product by ID (admin only)
router.put("/products/:id/activate"); // Activates a product by ID (admin only)

router.post(
  "/products",
  verify,
  verifyAdmin,
  productController.createNewProduct
);

module.exports = router;
