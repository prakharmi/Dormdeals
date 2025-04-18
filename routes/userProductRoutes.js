const express = require("express");
const UserProductController = require("../controllers/userProductController");

const router = express.Router();

// GET routes
router.get("/user-products", UserProductController.getUserProducts);

// PUT routes
router.put("/product/:id", UserProductController.updateProduct);
router.put("/product/:id/status", UserProductController.toggleProductStatus);

// DELETE routes
router.delete("/product/:id", UserProductController.deleteProduct);

module.exports = router;