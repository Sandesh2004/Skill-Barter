import React from 'react';
import './Footer.css'; // Import the CSS for the Footer component
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


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
          <ul>
                  <Link to="/home" className="nav-link">Home</Link> <br />
                  <Link to="/home/exchange" className="nav-link">Exchange</Link> <br />
                  <Link to="/home/notifications" className="nav-link">Notifications</Link> <br />
                  <Link to="/home/about" className="nav-link">About Us</Link>
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
