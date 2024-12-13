import React from 'react';
import './Hero.css'; // Import the CSS for the Hero component

function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <img
          src="/skill-barter-logo.png"
          alt="Skill-Barter Logo"
          className="hero-logo"
        />
        <h1 className="hero-title">Skill-Barter</h1>
        <p className="hero-tagline">Exchange Skills, Grow Together</p>
        <p className="hero-description">
          Join our community where professionals and learners come together to exchange skills,
          share knowledge, and create meaningful connections through skill bartering.
        </p>
      </div>
    </div>
  );
}

export default Hero;
