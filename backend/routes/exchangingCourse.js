const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Adjust the path based on your project structure
const ExchangingCourse = require("../models/ExchangingCourse");
const authenticateUser = require("../middleware/authenticateuser");
const { check, validationResult } = require("express-validator");

// Add a course to exchange
router.post(
  "/add-course",
  authenticateUser, // Ensure the user is authenticated
  [
    check("course", "Course is required").not().isEmpty(),
    check("period", "Period is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { course, period } = req.body;

    try {
      // Ensure the user exists before adding the course
      const user = await User.findById(req.userId);
      if (!user) return res.status(400).json({ message: "User not found" });

      // Check if the course already exists for the user
      const existingCourse = await ExchangingCourse.findOne({
        userId: req.userId,
        course,
      });

      if (existingCourse) {
        return res.status(400).json({
          message: "This course is already added for exchange.",
        });
      }

      // Create a new course for exchange
      const newExchangeCourse = new ExchangingCourse({
        userId: req.userId, // Use the authenticated user's ID
        course,
        period,
      });

      await newExchangeCourse.save();
      res
        .status(201)
        .json({ message: "Course added for exchange.", data: newExchangeCourse });
    } catch (err) {
      console.error("Add course error:", err.message);
      res.status(500).json({ message: "Failed to add course for exchange." });
    }
  }
);

// Update an existing exchange course
router.put(
  "/update-course",
  authenticateUser,
  [
    check("course", "Course is required").not().isEmpty(),
    check("period", "Period is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { course, period } = req.body;

    try {
      // Ensure the user exists before updating the course
      const user = await User.findById(req.userId);
      if (!user) return res.status(400).json({ message: "User not found" });

      // Find the existing course for the user
      const exchangeCourse = await ExchangingCourse.findOne({
        userId: req.userId,
        course,
      });

      if (!exchangeCourse) {
        return res.status(404).json({
          message: "Course not found for the authenticated user.",
        });
      }

      // Update the course's period
      exchangeCourse.period = period;
      await exchangeCourse.save();

      res.status(200).json({
        message: "Course updated successfully.",
        data: exchangeCourse,
      });
    } catch (err) {
      console.error("Update course error:", err.message);
      res.status(500).json({ message: "Failed to update course." });
    }
  }
);

// Fetch all exchanging courses for a user
router.get("/my-courses", authenticateUser, async (req, res) => {
  try {
    // Ensure the user exists before fetching courses
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Fetch the courses for the authenticated user
    const courses = await ExchangingCourse.find({ userId: req.userId });
    res.status(200).json(courses);
  } catch (err) {
    console.error("Fetch courses error:", err.message);
    res.status(500).json({ message: "Failed to fetch exchange courses." });
  }
});

// Remove a course from exchange
router.delete("/delete-course/:courseId", authenticateUser, async (req, res) => {
  const { courseId } = req.params;

  try {
    // Ensure the user exists before deleting the course
    const user = await User.findById(req.userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    // Find and delete the course for the authenticated user
    const exchangeCourse = await ExchangingCourse.findOneAndDelete({
      _id: courseId,
      userId: req.userId,
    });

    if (!exchangeCourse) {
      return res.status(404).json({ message: "Course not found for deletion." });
    }

    res.status(200).json({
      message: "Course successfully removed from exchange.",
      data: exchangeCourse,
    });
  } catch (err) {
    console.error("Delete course error:", err.message);
    res.status(500).json({ message: "Failed to remove course from exchange." });
  }
});

module.exports = router;
