const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

// GET routes
router.get("/check-user/:email", UserController.checkUser);

// POST routes
router.post("/submit-form", UserController.submitForm);

module.exports = router;
