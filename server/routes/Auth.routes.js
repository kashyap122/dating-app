const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const BACKEND_URL  = process.env.BACKEND_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/?error=oauth` }),
  (req, res) => {
    // `req.user` is the user returned by your Passport verify callback
    // If they have no password yet (first-time Google login), send them to set one:
    if (!req.user.password) {
      const redirectUrl = `${FRONTEND_URL}/set-password?userId=${req.user._id}`;
      return res.redirect(redirectUrl);
    }

    // Otherwise generate a JWT and redirect back to your React app:
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // You can either:
    //  a) Redirect with the token in the URL
    //  b) Return JSON if you’re calling this via XHR
    // Here we redirect so the React <AuthHandler> can pick it up:
    res.redirect(`${FRONTEND_URL}/auth-handler?token=${token}`);
  }
);


router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/set-password', authController.setPassword);

module.exports = router;
