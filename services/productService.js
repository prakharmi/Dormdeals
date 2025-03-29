const Product = require("../models/Product");
const ProductImage = require("../models/ProductImage");

class ProductService {
  static async createProduct(productData, files) {
    try {
      // Validate data
      const { productName, category, description, price, college } =
        productData;

      if (
        !productName ||
        !category ||
        !description ||
        !price ||
        !college ||
        files.length === 0
      ) {
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

      // Create image entries
      const imageValues = files.map((file) => [productId, file.filename]);
      await ProductImage.createMany(imageValues);

      return productId;
    } catch (error) {
      throw error;
    }
  }

  static async getProductsByCollege(college, category) {
    try {
      const products = await Product.findByCollege(college, category);

      // Format image URLs
      return products.map((product) => {
        if (product.image) {
          product.image = `${
            process.env.NODE_ENV === "production"
              ? "https://your-production-url.com"
              : "http://127.0.0.1:" + process.env.PORT
          }/uploads/${product.image}`;
        }
        return product;
      });
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

      // Format image URLs
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com"
          : `http://127.0.0.1:${process.env.PORT}`;

      product.images = images.map(
        (img) => `${baseUrl}/uploads/${img.image_url}`,
      );

      return product;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
