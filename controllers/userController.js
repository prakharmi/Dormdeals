const UserService = require("../services/userService");

class UserController {
  static async checkUser(req, res) {
    try {
      const email = decodeURIComponent(req.params.email);
      console.log("Checking if user exists with email:", email);

      const result = await UserService.checkUserExists(email);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error checking user:", error);
      return res.status(500).json({
        message: "Database error",
        error: error.message,
      });
    }
  }

  static async submitForm(req, res) {
    try {
      const { name, college, mobile, email } = req.body;

      await UserService.createUser({
        name,
        college,
        mobile_number: mobile,
        email,
      });

      return res.status(200).json({ message: "Successfully saved user data" });
    } catch (error) {
      console.error("Error inserting data into MySQL:", error);
      return res.status(500).json({
        message: "Database error",
        error: error.message,
      });
    }
  }

  static async getUserDetails(req, res) {
    try {
      const email = decodeURIComponent(req.params.email);
      
      const user = await UserService.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({
        message: "Database error",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;