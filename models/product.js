const db = require("../config/database").pool;

class Product {
  static async create(productData) {
    const { name, category, description, price, college } = productData;
    try {
      const [result] = await db.query(
        "INSERT INTO products (name, category, description, price, college) VALUES (?, ?, ?, ?, ?)",
        [name, category, description, price, college],
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByCollege(college, category = null) {
    try {
      let query = `
        SELECT p.*, 
               (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS image 
        FROM products p 
        WHERE p.college = ?
      `;
      const params = [college];

      if (category) {
        query += " AND p.category = ?";
        params.push(category);
      }

      const [rows] = await db.query(query, params);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
        id,
      ]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
