const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors({
  origin: "http://127.0.0.1:5500",
  methods: ["GET", "POST"]
}));

app.use(express.static(path.join(__dirname, "User Info")));
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

    if (results.length > 0) {
      res.status(200).json({ exists: true, user: results[0] });
    } else {
      res.status(200).json({ exists: false });
    }
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
    console.log("Insertion result:", result);
    res.status(200).json({ message: "Successfully saved user data" });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});