const express = require("express");
const ProductController = require("../controllers/productController");
const upload = require("../config/multer");

const router = express.Router();

// GET routes
router.get("/products", ProductController.getProducts);
router.get("/product/:id", ProductController.getProductById);

// POST routes
router.post(
  "/submit-product",
  upload.array("photos", 10),
  ProductController.submitProduct,
);

module.exports = router;
