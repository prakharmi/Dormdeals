// models/product.js
const db = require("../config/database").pool;

class Product {
  static async create(productData) {
    const { name, category, description, price, college, user_email } = productData;
    try {
      const [result] = await db.query(
        "INSERT INTO products (name, category, description, price, college, user_email) VALUES (?, ?, ?, ?, ?, ?)",
        [name, category, description, price, college, user_email],
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
               (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS image,
               u.name as sellerName, u.mobile_number as sellerMobile
        FROM products p 
        LEFT JOIN users u ON p.user_email = u.email
        WHERE p.college = ? AND p.is_sold = 0
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
  
  static async findByUserEmail(email) {
    try {
      const query = `
        SELECT p.*, 
              (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS image,
              u.name as sellerName, u.mobile_number as sellerMobile
        FROM products p 
        LEFT JOIN users u ON p.user_email = u.email
        WHERE p.user_email = ?
      `;
      
      const [rows] = await db.query(query, [email]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      // Updated query to include seller information from the users table
      const query = `
        SELECT p.*, 
               u.name as sellerName, 
               u.mobile_number as sellerMobile, 
               u.college as sellerCollege,
               u.email as sellerEmail
        FROM products p 
        LEFT JOIN users u ON p.user_email = u.email
        WHERE p.id = ?
      `;
      
      const [rows] = await db.query(query, [id]);
      
      if (rows.length > 0) {
        // Log to debug
        console.log("Product found with seller info:", {
          id: rows[0].id,
          name: rows[0].name,
          sellerName: rows[0].sellerName,
          sellerMobile: rows[0].sellerMobile
        });
      }
      
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error("Error in Product.findById:", error);
      throw error;
    }
  }
  
  static async update(id, productData) {
    const { name, category, description, price } = productData;
    try {
      const [result] = await db.query(
        "UPDATE products SET name = ?, category = ?, description = ?, price = ? WHERE id = ?",
        [name, category, description, price, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  static async delete(id) {
    try {
      // Start a transaction
      await db.query("START TRANSACTION");
      
      // Delete all product images
      await db.query("DELETE FROM product_images WHERE product_id = ?", [id]);
      
      // Delete the product
      const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
      
      // Commit the transaction
      await db.query("COMMIT");
      
      return result.affectedRows > 0;
    } catch (error) {
      // Rollback on error
      await db.query("ROLLBACK");
      throw error;
    }
  }
  
  static async updateStatus(id, isSold) {
    try {
      const [result] = await db.query(
        "UPDATE products SET is_sold = ? WHERE id = ?",
        [isSold, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;