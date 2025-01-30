const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 5000;

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "dormdealsuser",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err.message);
    return;
  }
  console.log("Successfully connected to the database");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "detailspage.html"));
});

app.post("/submit-form", (req, res) => {
  const { name, college, mobile } = req.body;
  console.log("Data being sent to the database:", { name, college, mobile });

  const query =
    "INSERT INTO users (name, college, mobile_number) VALUES (?, ?, ?)";
  db.query(query, [name, college, mobile], (err, result) => {
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
