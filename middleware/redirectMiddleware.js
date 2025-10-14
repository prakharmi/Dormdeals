// Middleware to redirect authenticated users from the main page
const redirectToProductsIfLoggedIn = (req, res, next) => {
  // Check if the user is authenticated and has a college set
  if (req.isAuthenticated() && req.user && req.user.college) {
    // Construct the URL with the user's college
    const collegeQuery = encodeURIComponent(req.user.college);
    return res.redirect(`/products?college=${collegeQuery}`);
  }
  // If not logged in
  return next();
};

module.exports = { redirectToProductsIfLoggedIn };
