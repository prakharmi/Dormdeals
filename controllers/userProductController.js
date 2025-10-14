const Product = require("../models/product");
const UserProductService = require("../services/userProductService");

class UserProductController {
  // Fetches all products listed by the currently authenticated user.
  static async getUserProducts(req, res) {
    try {
      const userEmail = req.user.email;
      const products = await Product.findByUserEmail(userEmail);
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching user products:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Updates a product's details after verifying ownership.
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const userEmail = req.user.email;

      // Verify that the logged-in user owns this product
      const product = await UserProductService.verifyOwnership(id, userEmail);
      if (!product) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not own this product." });
      }

      const updated = await Product.update(id, req.body);
      if (!updated) {
        return res
          .status(404)
          .json({ message: "Product not found or could not be updated." });
      }

      res.status(200).json({ message: "Product updated successfully." });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Deletes a product after verifying ownership.
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const userEmail = req.user.email;

      const product = await UserProductService.verifyOwnership(id, userEmail);
      if (!product) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not own this product." });
      }

      await UserProductService.deleteProduct(id);

      res.status(200).json({ message: "Product deleted successfully." });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Toggles a product's 'is_sold' status after verifying ownership.
  static async toggleProductStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_sold } = req.body;
      const userEmail = req.user.email;

      if (is_sold === undefined) {
        return res
          .status(400)
          .json({ message: "The 'is_sold' status is required." });
      }

      const product = await UserProductService.verifyOwnership(id, userEmail);
      if (!product) {
        return res
          .status(403)
          .json({ message: "Forbidden: You do not own this product." });
      }

      await Product.updateStatus(id, is_sold);
      const statusText = is_sold ? "sold" : "available";

      res
        .status(200)
        .json({ message: `Product marked as ${statusText} successfully.` });
    } catch (error) {
      console.error("Error updating product status:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = UserProductController;
