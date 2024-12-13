const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" }, // Reference to Profile
  tokens: { type: Number, default: 0 }, // Store tokens
  otp: { type: String, sparse: true},  // Store OTP as a string (6-digit)
  otpExpiry: { type: Date, sparse: true }, // Add "sparse" to allow multiple nulls
  phone: { type: String, sparse: true },  // Store phone number for OTP verification
});

module.exports = mongoose.model("User", UserSchema);
