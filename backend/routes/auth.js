const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const router = express.Router();

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Username
router.put("/username/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { newUsername } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!newUsername || newUsername.trim() === "") {
      return res.status(400).json({ message: "New username is required" });
    }

    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { _id, username, email } = user;
    res.status(200).json({
      message: "Username updated successfully",
      user: { _id, username, email },
    });
  } catch (err) {
    res.status(500).json({ error: "An error occurred while updating the username", details: err.message });
  }
});

module.exports = router;
