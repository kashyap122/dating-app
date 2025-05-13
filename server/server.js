require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./database/mongo.database");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const path = require("path");

const app = express();

// Frontend origin (for Vite dev)
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 1) CORS: allow your frontend and handle preflight
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.options("*", cors());

// 2) Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3) Session & Passport (if you’re still using sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 4) Static uploads (if needed later)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5) Routes
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// 6) Health check / root
app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

// 7) Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

// 8) Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🟢 Server running on http://localhost:${PORT}/`)
);
