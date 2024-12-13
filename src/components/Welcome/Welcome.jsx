import React from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">

      {/* Image Background */}
      <div className="image-background"></div>

      {/* Hero Section */}
      <div className="hero">
        <h1 className="tagline">Welcome to Skill Barter</h1>
        <p className="subtitle">
          Unlock a world of possibilities by sharing and learning new skills.
        </p>
        <button className="welcome-btn-hover" onClick={() => navigate("/login")}>
          Start Exchanging
        </button>
      </div>

      {/* Main Section */}
      <header className="welcome-header">
        <div className="welcome-title">Skill Barter</div>
      </header>

    </div>
  );
};

export default Welcome;