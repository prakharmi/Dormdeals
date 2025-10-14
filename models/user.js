const db = require("../config/database").pool;

class User {
  /**
   * Finds a user by their primary key ID.
   * Required for Passport's deserializeUser function.
   */
  static async findById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Finds a user by their unique email address.
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

  // Finds a user by their unique Google ID.
  static async findByGoogleId(googleId) {
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE googleId = ?", [
        googleId,
      ]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Creates a new user in the database.
  static async create(userData) {
    const { name, college, mobile_number, email, googleId, picture } = userData;
    try {
      const [result] = await db.query(
        "INSERT INTO users (name, college, mobile_number, email, googleId, picture) VALUES (?, ?, ?, ?, ?, ?)",
        [name, college, mobile_number, email, googleId, picture],
      );
      // After creating, fetch the full user object to return
      const newUser = await this.findById(result.insertId);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async updateGoogleProfile(email, { googleId, picture }) {
    try {
      const [result] = await db.query(
        "UPDATE users SET googleId = ?, picture = ? WHERE email = ?",
        [googleId, picture, email],
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
