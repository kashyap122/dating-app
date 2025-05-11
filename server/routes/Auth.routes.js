const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect('/');
    }

    if (!user.password) {
      // Redirect to set-password if password is not set
      return res.redirect(`http://localhost:5173/set-password?userId=${user._id}`);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.redirect(`http://localhost:5173/auth-handler?token=${token}`);
    
  })(req, res, next);
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post('/set-password', authController.setPassword);

module.exports = router;
