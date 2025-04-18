const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const userProductRoutes = require("./routes/userProductRoutes"); // Add the new routes

// Import middleware
const errorHandler = require("./middleware/errorHandler");

// Create Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"], // Add PUT and DELETE methods
  }),
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_PATH)),
);

// Use routes
app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", userProductRoutes); // Use the new routes

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "User Info", "userinfo.html"));
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;

const fs = require('fs');
if (!fs.existsSync('tmp/uploads')) {
  fs.mkdirSync('tmp/uploads', { recursive: true });
}