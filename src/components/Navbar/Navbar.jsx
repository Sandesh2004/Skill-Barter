import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css'; // Custom CSS for styling

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-sign">
        Skill-Barter
      </div>
      <div className="navbar-left">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/home/exchange" className="nav-link">Exchange</Link>
        <Link to="/home/notifications" className="nav-link">Notifications</Link>
        <Link to="/home/about" className="nav-link">About Us</Link>
      </div>
      <div className="navbar-right">
        <button className="profile-btn" onClick={toggleDropdown}>
          <img
            src="https://via.placeholder.com/40" // Replace with actual profile image if needed
            alt="Profile"
            className="profile-image"
          />
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/home/profile" className="dropdown-item">Profile</Link>
            <a href="#settings" className="dropdown-item">Settings</a>
            <a href="#logout" className="dropdown-item">Logout</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
