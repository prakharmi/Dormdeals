const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 5000;

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  }),
);

app.use(express.static(path.join(__dirname, "User Info")));
app.use(express.static(path.join(__dirname, "Product Info")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "sherlockholmes@mysql",
  database: "dormdealsuser",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err.message);
    return;
  }
  console.log("Successfully connected to the database");
});

app.get("/check-user/:email", (req, res) => {
  const email = decodeURIComponent(req.params.email);
  console.log("Checking if user exists with email:", email);

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error checking user:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log(`Found ${results.length} users with this email`);
    res
      .status(200)
      .json({ exists: results.length > 0, user: results[0] || null });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "User Info", "userinfo.html"));
});

app.post("/submit-form", (req, res) => {
  const { name, college, mobile, email } = req.body;
  const query =
    "INSERT INTO users (name, college, mobile_number, email) VALUES (?, ?, ?, ?)";
  db.query(query, [name, college, mobile, email], (err, result) => {
    if (err) {
      console.error("Error inserting data into MySQL:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    console.log("User inserted:", result);
    res.status(200).json({ message: "Successfully saved user data" });
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/submit-product", upload.array("photos", 10), (req, res) => {
  const { productName, category, description, price, college } = req.body;
  const imageFiles = req.files;

  if (
    !productName ||
    !category ||
    !description ||
    !price ||
    !college ||
    imageFiles.length === 0
  ) {
    return res
      .status(400)
      .json({ message: "All fields and at least one image are required" });
  }

  const productQuery =
    "INSERT INTO products (name, category, description, price, college) VALUES (?, ?, ?, ?, ?)";
  db.query(
    productQuery,
    [productName, category, description, price, college],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      const productId = result.insertId;
      console.log("Product inserted with ID:", productId);

      const imageQuery =
        "INSERT INTO product_images (product_id, image_url) VALUES ?";
      const imageValues = imageFiles.map((file) => [productId, file.filename]);

      db.query(imageQuery, [imageValues], (err, imageResult) => {
        if (err) {
          console.error("Error inserting images:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }
        console.log("Images inserted:", imageResult);
        res.status(200).json({ message: "Product added successfully" });
      });
    },
  );
});

app.get("/products", async (req, res) => {
  const college = req.query.college;
  console.log("College received in request:", college);

  if (!college) {
    return res.status(400).json({ error: "College is required" });
  }

  try {
    const query = `
    SELECT p.*, 
           (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) AS image 
    FROM products p 
    WHERE p.college = ?
  `;

    db.query(query, [college], (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res
          .status(500)
          .json({ error: "Database error", details: error.message });
      }

      if (!Array.isArray(results)) {
        return res
          .status(500)
          .json({ error: "Unexpected database response format" });
      }
      
      const productsWithImages = results.map(product => {
        if (product.image) {
          // Make sure the image URL is a complete path
          product.image = `http://127.0.0.1:5000/uploads/${product.image}`;
        }
        return product;
      });

      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
