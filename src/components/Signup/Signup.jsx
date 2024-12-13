import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login-signup.css'; // Ensure you have this CSS file for consistent styling

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Navigate to the login page after successful signup
        navigate("/login");
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred while signing up. Please try again.");
    }
  };

  return (
    <div>
      {/* Video Background */}
      <div className="image-background">
        {/* Background content */}
      </div>

      {/* Form Container */}
      <div className="form-container">
        <h1>Sign Up</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
};

export default Signup;