import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./SearchCourse.css"

const SearchCourse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const periods = ["All Weekdays", "Mon-Fri", "Mon-Sat", "Sat-Sun", "Only Sun"];
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async () => {
    setError(""); // Reset any previous errors
    setSuccess("");

    if (!searchTerm) {
      setError("Please enter a course name to search.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/courses/search-users-by-course", {
        params: { searchTerm, selectedPeriod }, // Pass selectedPeriod to the backend
      });

      setUsers(response.data); // Set the fetched users offering the course
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`); // Navigate to the user profile page
  };

  const handleRequestExchange = async (receiverId) => {
    setError("");
    setSuccess("");
    setLoading(true);
  
    try {
      const senderId = localStorage.getItem("userId"); // Assuming sender ID is stored in localStorage
      console.log("Sender ID:", senderId); // Debugging line to check the value

      if (!senderId) {
        setError("User not logged in.");
        return;
      }
  
      // Make the request to send an exchange notification
      const response = await axios.post("http://localhost:5000/api/notifications/request-exchange", {
        senderId,          // Sender's user ID
        receiverId,        // Receiver's user ID
        course: searchTerm, // Course name passed from the search term
      });
  
      setSuccess(response.data.message || "Exchange request sent successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to send exchange request. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="search-course">
      <h2>Search for Users Offering a Course</h2>

      {/* Search input for course name */}
      <input
        type="text"
        placeholder="Search by course name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter dropdown for course period */}
      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
      >
        <option value="">Select period</option>
        {periods.map((period, index) => (
          <option key={index} value={period}>
            {period}
          </option>
        ))}
      </select>

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Display error and success messages */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Display users offering the searched course */}
      <div>
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.userId}>
                <img src={user.profilePhoto} alt={`${user.name}'s profile`} />
                <p>Name: {user.name}</p>
                <p>Rating: {user.rating}</p>
                <button onClick={() => handleViewProfile(user.userId)}>View Profile</button>
                <button
                  onClick={() => handleRequestExchange(user.userId)}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Request Exchange"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found for this course.</p>
        )}
      </div>
    </div>
  );
};

export default SearchCourse;
