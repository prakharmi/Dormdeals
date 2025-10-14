const User = require("../models/user");
const passport = require("passport");

// Initiates Google OAuth authentication
const authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"], // The data we request from Google
});

// Handles the callback after Google has authenticated the user
const authGoogleCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return next(err);

    // If authentication fails
    if (!user) {
      return res.redirect("/?error=" + encodeURIComponent(info.message));
    }

    // If the user is new (identified by the 'isNew' flag from our Passport config)
    if (user.isNew) {
      // Store their temporary profile info in the session and redirect to the registration form
      req.session.newUserProfile = user;
      return res.redirect("/user-info");
    }

    // If it's an existing user, log them in to create a persistent session
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/"); // Redirect to the product listing page
    });
  })(req, res, next);
};

// Registers a new user after they submit the info form
const registerUser = async (req, res, next) => {
  try {
    const { name, college, mobile } = req.body;
    const newUserProfile = req.session.newUserProfile;

    // Ensure we still have the temporary profile from the Google login
    if (!newUserProfile || !newUserProfile.email) {
      return res
        .status(400)
        .json({
          message: "Authentication session expired. Please log in again.",
        });
    }

    // Combine form data with Google profile data to create the new user
    const userToCreate = {
      ...newUserProfile, // Contains email, googleId, picture
      name,
      college,
      mobile_number: mobile,
    };

    const createdUser = await User.create(userToCreate);

    // Clear the temporary profile data
    req.session.newUserProfile = null;

    // Log the newly created user in
    req.logIn(createdUser, (err) => {
      if (err) return next(err);
      // Respond with success and where to redirect the frontend
      res
        .status(201)
        .json({
          message: "Registration successful!",
          redirectTo: `/products?college=${encodeURIComponent(createdUser.college)}`,
        });
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res
      .status(500)
      .json({ message: "Failed to register user due to a server error." });
  }
};

// Provides the frontend with the current user's login status
const getUserStatus = (req, res) => {
  if (req.isAuthenticated()) {
    // If logged in, send back public user data
    res.json({
      isAuthenticated: true,
      user: {
        name: req.user.name,
        email: req.user.email,
        college: req.user.college,
        picture: req.user.picture,
      },
    });
  } else {
    // If not logged in, confirm that
    res.json({ isAuthenticated: false, user: null });
  }
};

// Gets temporary new user info to pre-fill the registration form
const getNewUserInfo = (req, res) => {
  if (req.session.newUserProfile) {
    res.json({
      name: req.session.newUserProfile.name,
      email: req.session.newUserProfile.email,
    });
  } else {
    // This can happen if the user refreshes the page or their session expires
    res.status(404).json({ message: "No new user registration in progress." });
  }
};

// Logs the user out and destroys the session
const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    // On successful logout, redirect to the homepage
    res.redirect("/");
  });
};

module.exports = {
  authGoogle,
  authGoogleCallback,
  registerUser,
  getUserStatus,
  getNewUserInfo,
  logoutUser,
};
