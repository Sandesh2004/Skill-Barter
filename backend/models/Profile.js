const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  bio: { type: String, default: "" },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  qualifications: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  courses: [{ type: String }], // Array of strings for courses
  ratings: { type: Number, default: 0 },
  reviews: [{ type: String }], // Array of strings for reviews
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
  profilePhoto: { type: Buffer }, // Store image as Buffer
});

module.exports = mongoose.model("Profile", ProfileSchema);
