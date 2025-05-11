const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, confirmPassword } =
      req.body;

    if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "User ID and new password are required." });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user || !user.googleId) {
      return res.status(400).json({ message: "Invalid request or user not from Google login." });
    }
    
    if (user.password) {
      return res.status(400).json({ message: "Password already set." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: "Password set successfully!" });
  } catch (error) {
    console.error("Error setting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
