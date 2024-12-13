import React from 'react';
import './Footer.css'; // Import the CSS for the Footer component

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">Skill-Barter</h3>
          <p className="footer-description">Exchange skills, grow together.</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">Home</a></li>
            <li><a href="#" className="footer-link">Exchange</a></li>
            <li><a href="#" className="footer-link">About Us</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <p className="footer-description">Email: info@skillbarter.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Skill-Barter. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
