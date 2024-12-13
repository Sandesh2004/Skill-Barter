import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import defaultProfileImage from "../../assets/default_photo.jpg";

const ProfileView = () => {
  const { userId } = useParams(); // Get userId from URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/${userId}`); // Dynamic userId
        setProfile(response.data);
      } catch (err) {
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="profile-view">
      <h2>User Profile</h2>
      {profile && (
        <div className="profile-info">
          <img
            src={profile.profilePhoto ? `data:image/jpeg;base64,${profile.profilePhoto}` : defaultProfileImage}
            alt="Profile"
            className="profile-photo"
          />
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Bio:</strong> {profile.bio}</p>
          <p><strong>Age:</strong> {profile.age}</p>
          <p><strong>Qualifications:</strong> {profile.qualifications}</p>
          <p><strong>City:</strong> {profile.city}</p>
          <p><strong>State:</strong> {profile.state}</p>
          <p><strong>Country:</strong> {profile.country}</p>
          <p><strong>Courses:</strong> {profile.courses.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
