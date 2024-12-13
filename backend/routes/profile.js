require('dotenv').config(); // Load environment variables

const express = require("express");
const Profile = require("../models/Profile");
const User = require("../models/User");
const authenticateUser = require("../middleware/authenticateuser"); // Import the middleware

const multer = require("multer"); // For handling file uploads
const twilio = require("twilio"); // Import Twilio
const crypto = require("crypto"); // To generate OTPs
const moment = require("moment"); // To handle expiration times
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");

const path = require("path");
const fs = require("fs");

const router = express.Router();

// Twilio configuration (using environment variables)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Set up multer for file uploads (memory storage to store images in memory)
const storage = multer.memoryStorage(); // Changed to memory storage
const upload = multer({ storage }); // Use memory storage for multer

// Rate limiter for OTP requests
const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: "Too many OTP requests. Please try again later.",
});

// Function to send OTP
const sendOTP = async (phone) => {
  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
  console.log(`Generated OTP: ${otp}`); // Debugging log

  await twilioClient.messages.create({
    body: `Your OTP code is: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });

  return otp;
};

// Endpoint to send OTP
router.post("/send-otp", otpRateLimiter, authenticateUser, async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if the phone number is already associated with another user
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser._id.toString() !== req.userId.toString()) {
      return res.status(400).json({ message: "Phone number is already in use by another account." });
    }

    // Generate and send OTP
    const otp = await sendOTP(phone);

    // Save the OTP directly (no hashing) and set the expiry time
    const updatedUser = await User.findByIdAndUpdate(req.userId, {
      otp,  // Store the OTP directly
      otpExpiry: moment().add(5, "minutes").toISOString(),
      phone,
    }, { new: true });

    console.log(`User OTP: ${updatedUser.otp}`); // Debugging log

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Middleware to validate OTP (No hashing)
const validateOTP = async (req, res, next) => {
  const { otp } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(400).json({ message: "User not found" });

  // Check if OTP exists and is not expired
  if (!user.otp || moment(user.otpExpiry).isBefore(moment())) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Compare the OTP directly (no hashing)
  if (otp !== user.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  next();
};

// Endpoint for OTP verification
router.post("/verify-otp", authenticateUser, validateOTP, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { phoneVerified: true });
    res.status(200).json({ message: "Phone number verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Create Profile endpoint with photo upload
router.post("/create-profile", authenticateUser, upload.single("profilePhoto"), async (req, res) => {
  try {
    const { bio, name, age, qualifications, city, state, country, courses } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    let profilePhotoBuffer = null;
    if (req.file) {
      profilePhotoBuffer = req.file.buffer; // Store the image as Buffer in memory
    }

    const newProfile = new Profile({
      userId: req.userId,
      bio,
      name,
      age,
      phone: user.phone,
      qualifications,
      city,
      state,
      country,
      courses,
      profilePhoto: profilePhotoBuffer, // Save as Buffer
    });

    await newProfile.save();

    // Update the user with the profile reference and award tokens
    await User.findByIdAndUpdate(req.userId, {
      profile: newProfile._id,
      $inc: { tokens: 100 },
    });

    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Route to get the logged-in user's profile
router.get("/my-profile", authenticateUser, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert the Buffer to Base64 for the profile photo
    const profilePhotoBase64 = profile.profilePhoto ? profile.profilePhoto.toString('base64') : null;

    res.status(200).json({
      ...profile.toObject(),
      phoneVerified: user.phoneVerified,
      phone: user.phone.slice(-4).padStart(user.phone.length, '*'),
      profilePhoto: profilePhotoBase64, // Send the photo as base64
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Route to get another user's profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      ...profile.toObject(),
      phoneVerified: user.phoneVerified,
      phone: user.phone.slice(-4).padStart(user.phone.length, '*'),
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// Endpoint to update profile with photo upload
router.put("/:userId", authenticateUser, upload.single("profilePhoto"), async (req, res) => {
  try {
    const { bio, name, age, qualifications, city, state, country, courses } = req.body;

    const updateData = {
      bio,
      name,
      age,
      qualifications,
      city,
      state,
      country,
      courses,
    };

    // If a new profile photo is uploaded, save it as a buffer
    if (req.file) {
      const profile = await Profile.findOne({ userId: req.userId });
      if (profile && profile.profilePhoto) {
        // Optionally, remove the old photo if needed
      }

      updateData.profilePhoto = req.file.buffer; // Save new photo as Buffer
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.userId },
      updateData,
      { new: true }
    );

    if (!updatedProfile)
      return res.status(404).json({ message: "Profile not found" });

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
