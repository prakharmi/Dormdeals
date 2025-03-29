const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

// Create Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  }),
);

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "User Info")));
app.use(express.static(path.join(__dirname, "Product Info")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, process.env.UPLOAD_PATH)),
);

// Use routes
app.use("/", userRoutes);
app.use("/", productRoutes);

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "User Info", "userinfo.html"));
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
