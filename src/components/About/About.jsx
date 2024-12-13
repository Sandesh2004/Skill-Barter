
import React, { useState } from 'react'; // Import useState
import './About.css'; // Import the CSS for the About component
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";

function About() {
  return (
    <div>
      <Navbar />
      <div id="about" className="about-container">
        {/* About Content Section */}
        <div className="about-content">
          <h2 className="about-title">About Us</h2>
          <div className="about-text">
            <p className="about-description">
              Skill-Barter is a revolutionary platform that connects people who want to exchange their skills
              and knowledge. We believe in the power of collaborative learning and mutual growth through
              skill exchange.
            </p>
            <p className="about-description">
              Our mission is to create a global community where everyone can learn new skills by teaching
              what they know best. Whether you're a professional looking to expand your skillset or a
              beginner eager to learn, Skill-Barter is your platform for growth.
            </p>
            <p className="about-description">
              Join us in revolutionizing the way people learn and grow professionally through the art
              of skill bartering.
            </p>
          </div>
        </div>

      

      </div>
      <Footer />
    </div>
  );
}

export default About;