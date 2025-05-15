require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("./database/mongo.database");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "keyboard cat",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const authRoutes    = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");

app.use("/api/auth",    authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" });
});

app.use((err, req, res, next) => {
  console.error("💥", err);
  res.status(err.status || 500).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🟢 Server listening on http://localhost:${PORT}`));
