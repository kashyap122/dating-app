require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./database/Mongo.database");
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

// require("./passport/googleStrategy");

const app = express();

// Apply CORS middleware early
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize session if needed and then passport
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define your routes
const authRoutes = require("./routes/Auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "User Authentication" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Server running on http://localhost:${PORT}/`));
 