const mongoose = require("mongoose");

const exchangingCourseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: String, required: true },
  period: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  status: { type: String, default: "active" }, // Optional field for course status
});

module.exports = mongoose.model("ExchangingCourse", exchangingCourseSchema);
