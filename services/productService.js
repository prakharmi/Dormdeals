const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');
const path = require('path');

class ProductService {
  static async createProduct(productData, files) {
    try {
      // Validate data
      const { productName, category, description, price, college } = productData;

      if (!productName || !category || !description || !price || !college || files.length === 0) {
        throw new Error("All fields and at least one image are required");
      }

      // Create product
      const productId = await Product.create({
        name: productName,
        category,
        description,
        price,
        college,
      });

      // Upload images to Cloudinary
      const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload(file.path, {
            folder: "dormdeals", // Optional: organize images in a folder
            resource_type: 'auto'
          }, (error, result) => {
            // Remove temporary file after upload
            fs.unlink(file.path, err => {
              if (err) console.error("Error deleting temporary file:", err);
            });
            
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          });
        });
      });

      const cloudinaryUrls = await Promise.all(uploadPromises);
      
      // Create image entries with Cloudinary URLs
      const imageValues = cloudinaryUrls.map(url => [productId, url]);
      await ProductImage.createMany(imageValues);

      return productId;
    } catch (error) {
      throw error;
    }
  }

  static async getProductsByCollege(college, category) {
    try {
      const products = await Product.findByCollege(college, category);
      
      // No need to modify image URLs as they're now complete Cloudinary URLs
      return products;
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      const product = await Product.findById(productId);

      if (!product) {
        return null;
      }

      // Get product images
      const images = await ProductImage.findByProductId(productId);
      
      // We don't need to modify the URLs as they're already Cloudinary URLs
      product.images = images.map(img => img.image_url);

      return product;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;