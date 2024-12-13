const express = require("express");
const Course = require("../models/ExchangingCourse");
const Profile = require("../models/Profile");
const User = require("../models/User");
const router = express.Router();

// Search users offering a course with period filter
router.get("/search-users-by-course", async (req, res) => {
    const { searchTerm, selectedPeriod } = req.query;
  
    try {
      if (!searchTerm) {
        return res.status(400).json({ message: "Course name is required" });
      }
  
      // Create a filter object
      const filter = { course: { $regex: searchTerm, $options: "i" } };
  
      // If a period is selected, add it to the filter
      if (selectedPeriod && selectedPeriod !== "All Weekdays") {
        filter.period = selectedPeriod;
      }
  
      // Find all courses that match the searchTerm and selectedPeriod
      const courses = await Course.find(filter)
        .populate({
          path: 'userId',
          populate: {
            path: 'profile',
            select: 'name ratings', // Only select the necessary fields
          },
        });
  
      if (!courses.length) {
        return res.status(404).json({ message: "No courses found for the given search term and period" });
      }

      // Prepare the result (users with their profile and ratings)
    const result = courses.map(course => {
      const user = course.userId; // user is populated from the course

      // Check if profile exists
      const userProfile = user.profile ? user.profile : { name: 'N/A', ratings: 'N/A', profilePhoto: 'default.jpg' };

      return {
        userId: user._id,
        name: userProfile.name,
        rating: userProfile.ratings,
        profilePhoto: userProfile.profilePhoto,
      };
    });
  
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
