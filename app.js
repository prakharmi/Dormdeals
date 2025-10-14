const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const userProductRoutes = require("./routes/userProductRoutes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const {
  redirectToProductsIfLoggedIn,
} = require("./middleware/redirectMiddleware");

// Create Express app
const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files (CSS, JS, images) from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// API routes are prefixed with /api
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", userProductRoutes);

// Root URL serves the main page
app.get("/", redirectToProductsIfLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Main Page", "mainpage.html"));
});

// Products listing page
app.get("/products", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "Product Listing", "productlisting.html"),
  );
});

// Page to add a new product
app.get("/add-product", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "Product Details", "productdetails.html"),
  );
});

// Individual product page
app.get("/product/:id", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "Product Page", "productpage.html"),
  );
});

// User profile page
app.get("/profile", (req, res) => {
  res.sendFile(
    path.join(__dirname, "public", "User Profile", "userprofile.html"),
  );
});

// User information form page
app.get("/user-info", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "User Info", "userinfo.html"));
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
