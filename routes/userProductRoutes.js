const express = require("express");
const UserProductController = require("../controllers/userProductController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

// --- Protected Routes (All require authentication) ---

// Apply the middleware to all routes in this file
router.use(isAuthenticated);

// GET all products for the logged-in user
router.get("/user-products", UserProductController.getUserProducts);

// PUT (update) a specific product
router.put("/product/:id", UserProductController.updateProduct);

// PUT (update) a product's sold status
router.put("/product/:id/status", UserProductController.toggleProductStatus);

// DELETE a specific product
router.delete("/product/:id", UserProductController.deleteProduct);

module.exports = router;
