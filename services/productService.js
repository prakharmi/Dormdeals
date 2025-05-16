const Product = require("../models/product");
const ProductImage = require("../models/productimage");
const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const fs = require('fs');
const path = require('path');

class ProductService {
  static async createProduct(productData, files) {
    try {
      // Validate data
      const { productName, category, description, price, college, email } = productData;

      if (!productName || !category || !description || !price || !college || !email || files.length === 0) {
        throw new Error("All fields and at least one image are required");
      }

      // Create product with user_email
      const productId = await Product.create({
        name: productName,
        category,
        description,
        price,
        college,
        user_email: email, // Make sure this is passed to the database
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
      // Products will now only include those that are not marked as sold
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

      // Get seller information
      if (product.user_email) {
        const seller = await User.findByEmail(product.user_email);
        if (seller) {
          product.sellerName = seller.name;
          product.sellerMobile = seller.mobile_number;
          product.sellerCollege = seller.college;
        }
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;