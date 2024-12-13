import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login-signup.css'; // Ensure you have this CSS file for styles


const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Save the token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id); // Optional: Save user ID for future use

        // Navigate to the home page
        navigate("/home");
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (err) {
      setLoading(false);
      setError("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div>
      {/* Video Background */}
      <div className="image-background">
        
      </div>

      {/* Form Container */}
      <div className="form-container">
        <h1>Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <a href="/signup">Don't have an account? Sign up</a>
      </div>
    </div>
  );
};

export default Login;