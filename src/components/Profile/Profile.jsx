import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Verify from "../Verify/Verify.jsx"
import "./Profile.css";
import defaultProfileImage from "../../assets/default_photo.jpg"; // Adjust path based on your folder structure
import { useNavigate } from "react-router-dom";

const ProfileCreation = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
    bio: "",
    name: "",
    age: "",
    qualifications: "",
    city: "",
    state: "",
    country: "",
    courses: [""], // Initial empty course
    profilePhoto: null,
  });
  const [originalData, setOriginalData] = useState(null); // For discarding changes
  const [profile, setProfile] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isProfileCreated, setIsProfileCreated] = useState(false);



  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/profile/my-profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setOriginalData(response.data); // Set the original data for discard functionality
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Failed to fetch profile. Please try again.");
        }
      } finally {
        setLoading(false);
        setIsProfileCreated(true)
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePhoto: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCourseChange = (index, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = value;
    setFormData({ ...formData, courses: updatedCourses });
  };

  const addCourseField = () => {
    setFormData((prevData) => ({
      ...prevData,
      courses: [...prevData.courses, ""],
    }));
  };

  const removeCourseField = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      courses: prevData.courses.filter((_, i) => i !== index),
    }));
  };

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/profile/send-otp",
        { phone: formData.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(
        "http://localhost:5000/api/profile/verify-otp",
        { otp: formData.otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("OTP verified successfully!");
      setOtpVerified(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpVerified) {
      setError("Please verify your phone number before submitting the form.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "courses") {
          formData[key].forEach((course) =>
            formDataToSend.append("courses[]", course)
          );
        } else if (key === "profilePhoto" && formData[key]) {
          formDataToSend.append("profilePhoto", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        "http://localhost:5000/api/profile/create-profile",
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      alert("Profile created successfully!");
      setProfile(response.data);
      setOriginalData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const editProfile = () => {
    setFormData(profile);
    setIsEditing(true);
  };

  const saveProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (key === "courses") {
          formData[key].forEach((course) =>
            formDataToSend.append("courses[]", course)
          );
        } else if (key === "profilePhoto" && formData[key]) {
          formDataToSend.append("profilePhoto", formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.put(
        "http://localhost:5000/api/profile/update-profile",
        formDataToSend,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      alert("Profile updated successfully!");
      setProfile(response.data);
      setOriginalData(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const discardChanges = () => {
    setFormData(originalData);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  const renderCourses = () => (
    <>
      {formData.courses.map((course, index) => (
        <div key={index} className="course-field">
          <input
            type="text"
            value={course}
            onChange={(e) => handleCourseChange(index, e.target.value)}
            placeholder={`Course ${index + 1}`}
            
          />
          {(formData.courses.length > 1 || isEditing || !profile) && (
            <button type="button" onClick={() => removeCourseField(index)}>
              Remove
            </button>
          )}
        </div>
      ))}
      {(isEditing || !profile) && (
        <button type="button" onClick={addCourseField}>
          Add Course
        </button>
      )}
    </>
  );

  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState("");

  const handleTakeTest = () => {
    if (selectedTest) {
      navigate(`/verify/${selectedTest}`);
    } else {
      alert("Please select a test first!");
    }
  };

  return (
    <div>
      <Navbar />
      <main className="profile-wrapper">
        <div className="profile-container">
          <h2>{profile ? "Your Profile" : "Create Your Profile"}</h2>
          {error && <p className="error-message">{error}</p>}
          {loading && <p>Loading...</p>}
          {profile ? (
            !isEditing ? (
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
                <p><strong>Ratings:</strong> {profile.ratings}</p>
                <p><strong>Reviews:</strong> {profile.reviews}</p>
                <button onClick={editProfile}>Edit Profile</button>
              </div>
            ) : (
              <form onSubmit={saveProfile}>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Bio:
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Age:
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Qualifications:
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  City:
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  State:
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Country:
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </label>
                <label>Courses:</label>
                {renderCourses()}
                <label>
                  Profile Photo:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={!isEditing}
                  />
                  {photoPreview && <img src={photoPreview} alt="Preview" />}
                </label>
                <div className="button-group">
                  <button type="submit">Save Changes</button>
                  <button type="button" onClick={discardChanges}>
                    Discard Changes
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={createProfile}>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={otpSent || otpVerified}
                />
              </label>
              {!otpSent && (
                <button type="button" onClick={sendOtp} disabled={loading}>
                  Send OTP
                </button>
              )}
              {otpSent && !otpVerified && (
                <>
                  <label>
                    OTP:
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <button type="button" onClick={verifyOtp} disabled={loading}>
                    Verify OTP
                  </button>
                </>
              )}
              {otpVerified && (
                <>
                  <label>
                    Name:
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Bio:
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Age:
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Qualifications:
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    City:
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    State:
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>
                    Country:
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label>Courses:</label>
                  {renderCourses()}
                  <label>
                    Profile Photo:
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    {photoPreview && <img src={photoPreview} alt="Preview" />}
                  </label>
                  <button type="submit" disabled={loading}>
                    Create Profile
                  </button>
                </>
              )}
            </form>
            
            
          )}
          {/* Verification Section */}
          {isProfileCreated && profile?.courses?.length > 0 && (
            <div className="verification-container">
              <h3>Get Verified</h3>
              <div className="test-selection">
                <select
                  className="form-select"
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                >
                  <option value="">Select a Test</option>
                  {profile.courses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary mt-2" onClick={handleTakeTest}>
                  Take Test
                </button>
              </div>
            </div>
          )}
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default ProfileCreation;
