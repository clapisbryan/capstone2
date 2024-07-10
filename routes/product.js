const express = require("express");

const productController = require("../controller/product");

const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/", verify, verifyAdmin, productController.getProducts); // Create New Product (admin only)
router.get("/all", productController.retrieveAllproduct); // Retrieves all products.
router.get("/active", productController.retrieveActiveproduct); // Retrieves active products.
router.get("/:productsid", verify, productController.retrieveProductById); // Retrieves a single product by ID
router.patch("/:productsid/update", verify, verifyAdmin, productController.updateProductById); // Updates a product by ID (admin only)
router.patch("/:productsid/archive", verify, verifyAdmin, productController.archiveProduct); // Archives a product by ID (admin only)
router.patch("/:productsid/activate"); // Activates a product by ID (admin only)

router.post(
  "/products",
  verify,
  verifyAdmin,
  productController.createNewProduct
);

module.exports = router;
