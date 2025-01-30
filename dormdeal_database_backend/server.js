const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Route to handle product insertion
app.post("/addProduct", upload.single("product_image"), (req, res) => {
  const {
    seller_name,
    mobile_number,
    product_name,
    product_category,
    product_description,
    product_details,
    price,
  } = req.body;
  const product_photos = req.file ? req.file.filename : null;

  const query = `INSERT INTO products (seller_name, mobile_number, product_name, product_category, product_description, product_details, price, product_photos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      seller_name,
      mobile_number,
      product_name,
      product_category,
      product_description,
      product_details,
      price,
      JSON.stringify([product_photos]),
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting product:", err);
        res.status(500).send("Error adding product");
      } else {
        res.status(200).send("Product added successfully");
      }
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
