const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // Ensure the database is connected before starting the server
    await testConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
