const ProductService = require("../services/productService");

class ProductController {
  static async submitProduct(req, res) {
    try {
      const productData = req.body;
      const files = req.files;

      // Make sure the user's email is included (should be sent from frontend)
      if (!productData.email) {
        return res.status(400).json({ error: "User email is required" });
      }

      await ProductService.createProduct(productData, files);
      return res.status(200).json({ message: "Product added successfully" });
    } catch (error) {
      console.error("Error creating product:", error);
      return res.status(error.message.includes("required") ? 400 : 500).json({
        message: error.message || "Database error",
      });
    }
  }

  static async getProducts(req, res) {
    try {
      const { college, category } = req.query;

      if (!college) {
        return res.status(400).json({ error: "College is required" });
      }

      const products = await ProductService.getProductsByCollege(
        college,
        category,
      );
      return res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }

  static async getProductById(req, res) {
    try {
      const productId = req.params.id;

      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      const product = await ProductService.getProductById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
}

module.exports = ProductController;