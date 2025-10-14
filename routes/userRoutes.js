const express = require("express");
const UserController = require("../controllers/userController");

const router = express.Router();

// --- Authentication Routes ---
// Redirects user to Google's consent screen
router.get("/auth/google", UserController.authGoogle);

// The route Google redirects to after user consent
router.get("/auth/google/callback", UserController.authGoogleCallback);

// --- User Management Routes ---
// Endpoint for the /user-info page to submit registration data
router.post("/users/register", UserController.registerUser);

// Endpoint for the frontend to check if a user is logged in
router.get("/users/status", UserController.getUserStatus);

// Endpoint for the /user-info page to fetch pre-filled data (name, email)
router.get("/users/new-user-info", UserController.getNewUserInfo);

// Endpoint to log the user out
router.get("/users/logout", UserController.logoutUser);

module.exports = router;
