const db = require("../config/database").pool;

class User {
  static async findByEmail(email) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    const { name, college, mobile_number, email } = userData;
    try {
      const [result] = await db.query(
        "INSERT INTO users (name, college, mobile_number, email) VALUES (?, ?, ?, ?)",
        [name, college, mobile_number, email],
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
