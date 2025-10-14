// Middleware to check if a user is authenticated via Passport.js session.
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // If user is authenticated, proceed to the next middleware or route handler.
    return next();
  }
  // If not authenticated, send an error response.
  res
    .status(401)
    .json({
      message: "Unauthorized: You must be logged in to perform this action.",
    });
};

module.exports = { isAuthenticated };
