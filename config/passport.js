const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
require("dotenv").config();

// (The callbackURL and ALLOWED_DOMAINS constants remain the same)
// Determine the callback URL based on the environment
const callbackURL =
  process.env.NODE_ENV === "production"
    ? // Use the base URL for production and append the same path as development
      `https://dormdeals-backend.onrender.com/api/auth/google/callback`
    : `http://localhost:8080/api/auth/google/callback`;

const ALLOWED_DOMAINS = [
  "iiitsurat.ac.in",
  "iiitbhopal.ac.in",
  "iiitpune.ac.in",
  "iiitnagpur.ac.in",
  "iiitvadodara.ac.in",
];

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const emailDomain = email.split("@")[1];

        // 1. Domain Validation
        if (!ALLOWED_DOMAINS.includes(emailDomain)) {
          return done(null, false, {
            message: "Only users with a valid college email are allowed.",
          });
        }

        // 2. User Lookup & Migration
        let user = await User.findByEmail(email);

        if (user) {
          // If user exists but has no googleId, update their record.
          if (!user.googleId) {
            await User.updateGoogleProfile(email, {
              googleId: profile.id,
              picture: profile.photos[0].value,
            });
          }
          return done(null, user);
        } else {
          // If the user is new, pass their Google profile info to the route.
          const newUserProfile = {
            isNew: true,
            googleId: profile.id,
            name: profile.displayName,
            email: email,
            picture: profile.photos[0].value,
          };
          return done(null, newUserProfile);
        }
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

// (The serializeUser and deserializeUser functions remain exactly the same)
passport.serializeUser((user, done) => {
  if (!user.isNew) {
    done(null, user.id);
  } else {
    done(null, null);
  }
});

passport.deserializeUser(async (id, done) => {
  if (!id) {
    return done(null, false);
  }
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
