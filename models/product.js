const db = require("../config/database").pool;

class Product {
  // Creates a new product entry in the database.
  static async create(productData) {
    const { name, category, description, price, college, user_email } =
      productData;
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

  // Finds all available (not sold) products for a specific college.
  static async findByCollege(college, category = null) {
    try {
      let query = `
        SELECT p.*,
               (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS image,
               u.name as sellerName
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

  // Finds all products listed by a specific user email.
  static async findByUserEmail(email) {
    try {
      const query = `
        SELECT p.*,
              (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS image
        FROM products p
        WHERE p.user_email = ?
      `;
      const [rows] = await db.query(query, [email]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Finds a single product by its primary key ID, joining with user data.
  static async findById(id) {
    try {
      const query = `
        SELECT p.*,
               u.name as sellerName,
               u.mobile_number as sellerMobile
        FROM products p
        LEFT JOIN users u ON p.user_email = u.email
        WHERE p.id = ?
      `;
      const [rows] = await db.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Updates a product's details in the database.
  static async update(id, productData) {
    const { name, category, description, price } = productData;
    try {
      const [result] = await db.query(
        "UPDATE products SET name = ?, category = ?, description = ?, price = ? WHERE id = ?",
        [name, category, description, price, id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Deletes a product and its associated image records from the database.
  static async delete(id) {
    try {
      // The ON DELETE CASCADE constraint in the database will handle deleting
      // the corresponding 'product_images' records automatically.
      const [result] = await db.query("DELETE FROM products WHERE id = ?", [
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Updates the 'is_sold' status of a product.
  static async updateStatus(id, isSold) {
    try {
      const [result] = await db.query(
        "UPDATE products SET is_sold = ? WHERE id = ?",
        [isSold, id],
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
