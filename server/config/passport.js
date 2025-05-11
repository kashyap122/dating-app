const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/User.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile.id || !profile.emails || profile.emails.length === 0) {
          return done(new Error("Invalid Google profile data"), null);
        }

        // Check if a user already exists with this Google ID
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          console.log("✅ Google user found, logging in...");
          return done(null, existingUser);
        }

        // Check if a user exists with the same email (registered locally)
        const email = profile.emails[0].value;
        const userWithSameEmail = await User.findOne({ email });

        if (userWithSameEmail) {
          console.log("⚠️ Local user with same email exists. Linking Google ID...");
          userWithSameEmail.googleId = profile.id;
          await userWithSameEmail.save();
          return done(null, userWithSameEmail);
        }

        // Register new user
        console.log("🆕 Registering new Google user...");
        const newUser = new User({
          username: profile.displayName || email,
          email,
          googleId: profile.id,
          firstname: profile.name?.givenName || "",
          lastname: profile.name?.familyName || "",
          profilePic: profile.photos?.[0]?.value || "",
          password: null, // Google users don’t set a password yet
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        console.error("❌ Google Strategy Error:", err);
        return done(err, null);
      }
    }
  )
);

// Serialize user ID into session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user)).catch((err) => done(err, null));
});
