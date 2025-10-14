const ProductService = require("../services/productService");

class ProductController {
  // Creates a new product listing. Requires user to be authenticated.
  static async submitProduct(req, res) {
    try {
      const { email, college } = req.user;

      if (!email || !college) {
        return res
          .status(400)
          .json({
            message:
              "User information is incomplete. Please complete your profile.",
          });
      }

      const productData = {
        ...req.body, // Contains productName, category, description, price
        email, // Add email from session
        college, // Add college from session
      };

      const files = req.files; // Files are now in memory buffers

      // The productService will now handle the buffers for direct Cloudinary upload
      await ProductService.createProduct(productData, files);

      res.status(201).json({ message: "Product added successfully!" });
    } catch (error) {
      console.error("Error creating product:", error);
      // Check if it's a validation error from the service
      if (error.message.includes("required")) {
        return res.status(400).json({ message: error.message });
      }
      res
        .status(500)
        .json({ message: "An error occurred while creating the product." });
    }
  }

  // Fetches all non-sold products for a given college.
  static async getProducts(req, res) {
    try {
      const { college, category } = req.query;

      if (!college) {
        return res
          .status(400)
          .json({ error: "College is a required query parameter." });
      }

      const products = await ProductService.getProductsByCollege(
        college,
        category,
      );
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Fetches a single product by its ID. Publicly accessible.
  static async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = ProductController;
