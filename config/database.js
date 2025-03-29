const mysql = require("mysql2");
require("dotenv").config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    await promisePool.query("SELECT 1");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = {
  pool: promisePool,
  testConnection,
};
