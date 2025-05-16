const User = require("../models/user");

class UserService {
  static async checkUserExists(email) {
    try {
      const user = await User.findByEmail(email);
      return {
        exists: !!user,
        user: user || null,
      };
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email) {
    try {
      return await User.findByEmail(email);
    } catch (error) {
      throw error;
    }
  }

  static async createUser(userData) {
    try {
      // Validate data
      const { name, college, mobile_number, email } = userData;

      if (!name || !college || !mobile_number || !email) {
        throw new Error("Missing required fields");
      }

      // Validate mobile number
      if (!/^[0-9]{10}$/.test(mobile_number)) {
        throw new Error("Invalid mobile number format");
      }

      // Create user
      const userId = await User.create({
        name,
        college,
        mobile_number,
        email,
      });

      return userId;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;