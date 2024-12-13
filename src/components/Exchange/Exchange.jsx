import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import SearchCourse from "../SearchCourse/SearchCourse.jsx";
import "./Exchange.css"

const Exchange = () => {
  const token = localStorage.getItem("token");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [exchangeCourses, setExchangeCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track editing state
  const [editingCourseId, setEditingCourseId] = useState(null); // Track the course being edited

  const periods = ["All Weekdays", "Mon-Fri", "Mon-Sat", "Sat-Sun", "Only Sun"];

  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile/my-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailableCourses(response.data.courses || []);
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
      }
    };

    const fetchExchangeCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/exchange/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExchangeCourses(response.data);
      } catch (err) {
        setError("Failed to fetch exchange courses.");
      }
    };

    fetchAvailableCourses();
    fetchExchangeCourses();
  }, [token]);

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(""); // Clear errors on input change
  };

  const handleAddOrUpdateCourse = async () => {
    if (!selectedCourse || !selectedPeriod) {
      setError("Please select both a course and a period.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        // Update existing course
        await axios.put(
          `http://localhost:5000/api/exchange/update-course`,
          { course: selectedCourse, period: selectedPeriod, id: editingCourseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add new course
        await axios.post(
          "http://localhost:5000/api/exchange/add-course",
          { course: selectedCourse, period: selectedPeriod },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh exchange courses
      const response = await axios.get("http://localhost:5000/api/exchange/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExchangeCourses(response.data);

      // Reset form
      setSelectedCourse("");
      setSelectedPeriod("");
      setIsEditing(false);
      setEditingCourseId(null);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add/update course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course.course); // Pre-fill the course dropdown with the course name
    setSelectedPeriod(course.period); // Pre-fill the period dropdown
    setIsEditing(true); // Set editing mode
    setEditingCourseId(course._id); // Track the ID of the course being edited
  };

  const handleRemoveCourse = async (courseId) => {
    setLoading(true);
    try {
      // Remove course by ID
      await axios.delete(`http://localhost:5000/api/exchange/delete-course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh exchange courses
      const response = await axios.get("http://localhost:5000/api/exchange/my-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExchangeCourses(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter available courses to exclude already added courses, unless editing
  const filteredAvailableCourses = isEditing
    ? availableCourses
    : availableCourses.filter((course) => !exchangeCourses.some((ex) => ex.course === course));

  return (
    <div>
      <Navbar />
      <main className="exchange-main">
  

  {error && <p className="error-message">{error}</p>}

  <div className="exchange-courses-section">
    <h2>Your Exchange Courses</h2>
    {exchangeCourses.length > 0 ? (
      <ul className="course-list">
        {exchangeCourses.map((item, index) => (
          <li key={index} className="course-list-item">
            {item.course} - {item.period}
            <button onClick={() => handleEditCourse(item)}>Edit</button>
            <button onClick={() => handleRemoveCourse(item._id)}>Remove</button>
          </li>
        ))}
      </ul>
    ) : (
      <p>No exchange courses available. Add your first course below!</p>
    )}
  </div>

  <div className="exchange-form">
    <h2>{isEditing ? "Edit Course" : "Add Course for Exchange"}</h2>
    <label htmlFor="course-dropdown">Select a course:</label>
    <select
      id="course-dropdown"
      value={selectedCourse}
      onChange={handleInputChange(setSelectedCourse)}
      disabled={isEditing}
    >
      <option value="">--Select a course--</option>
      {filteredAvailableCourses.map((course, index) => (
        <option key={index} value={course}>
          {course}
        </option>
      ))}
    </select>

    <label htmlFor="period-dropdown">Select a period:</label>
    <select
      id="period-dropdown"
      value={selectedPeriod}
      onChange={handleInputChange(setSelectedPeriod)}
    >
      <option value="">--Select a period--</option>
      {periods.map((period, index) => (
        <option key={index} value={period}>
          {period}
        </option>
      ))}
    </select>

    <button onClick={handleAddOrUpdateCourse} disabled={loading}>
      {loading ? "Processing..." : isEditing ? "Update Course" : "Add to Exchange"}
    </button>
  </div>
</main>

      <SearchCourse />
      <Footer />
    </div>
  );
};

export default Exchange;
