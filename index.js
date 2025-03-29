const app = require("./app");
const { testConnection } = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Test database connection before starting the server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Start the server
startServer();
