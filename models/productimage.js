const db = require("../config/database").pool;

class ProductImage {
  // Creates a single record linking an image URL to a product.
  static async create(productId, imageUrl) {
    try {
      const [result] = await db.query(
        "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
        [productId, imageUrl],
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Creates multiple image records in a single, efficient query.
  static async createMany(imageData) {
    try {
      const [result] = await db.query(
        "INSERT INTO product_images (product_id, image_url) VALUES ?",
        [imageData],
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Finds all image URLs associated with a given product ID.
  static async findByProductId(productId) {
    try {
      const [rows] = await db.query(
        "SELECT image_url FROM product_images WHERE product_id = ?",
        [productId],
      );
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductImage;
