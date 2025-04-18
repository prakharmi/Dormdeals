// controllers/userProductController.js
const Product = require("../models/product");
const ProductImage = require("../models/productimage");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');

class UserProductController {
  static async getUserProducts(req, res) {
    try {
      const { email } = req.query;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      // Get products by user email
      const products = await Product.findByUserEmail(email);
      
      return res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching user products:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
  
  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, category, description, price } = req.body;
      
      if (!id || !name || !category || !description || !price) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // Update product
      const updated = await Product.update(id, {
        name,
        category,
        description,
        price,
      });
      
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      return res.status(200).json({ 
        success: true,
        message: "Product updated successfully" 
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
  
  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }
      
      // Get images to delete from cloudinary
      const images = await ProductImage.findByProductId(id);
      
      // Delete product
      const deleted = await Product.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      // Delete images from cloudinary
      for (const image of images) {
        // Extract the public_id from the URL
        const publicId = image.image_url.split('/').pop().split('.')[0];
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(`dormdeals/${publicId}`);
          } catch (cloudinaryError) {
            console.error("Error deleting image from Cloudinary:", cloudinaryError);
          }
        }
      }
      
      return res.status(200).json({ 
        success: true,
        message: "Product deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
  
  static async toggleProductStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_sold } = req.body;
      
      if (!id || is_sold === undefined) {
        return res.status(400).json({ error: "Product ID and status are required" });
      }
      
      // Update product status
      const updated = await Product.updateStatus(id, is_sold);
      
      if (!updated) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      return res.status(200).json({ 
        success: true,
        message: `Product marked as ${is_sold ? 'sold' : 'available'} successfully` 
      });
    } catch (error) {
      console.error("Error updating product status:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }
  }
}

module.exports = UserProductController;