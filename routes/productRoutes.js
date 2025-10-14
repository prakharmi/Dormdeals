const express = require("express");
const ProductController = require("../controllers/productController");
const upload = require("../config/multer");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// --- Public Routes (No Authentication Required) ---

// GET all available products for a college
router.get("/products", ProductController.getProducts);

// GET a single product by its ID
router.get("/product/:id", ProductController.getProductById);

// --- Protected Route (Authentication Required) ---

// POST a new product listing
router.post(
  "/submit-product",
  isAuthenticated, // Middleware: Ensures only logged-in users can access this
  upload.array("photos", 10), // Multer middleware for file handling
  ProductController.submitProduct,
);

module.exports = router;
