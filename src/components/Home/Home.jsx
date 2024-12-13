import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar.jsx'; 
import Footer from '../Footer/Footer.jsx';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the token exists
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login if token is missing
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="container">
      <Navbar />
      <main>
        <section className="content-section">
          <h3>Your Dashboard</h3>
          <p>
            We are excited to have you back! Explore new skills, connect with other users, and share your knowledge.
          </p>
          <div className="content-buttons">
            <button onClick={() => navigate("/explore")}>Explore Skills</button>
            <button onClick={() => navigate("/my-skills")}>My Skills</button>
          </div>
        </section>

        <section className="image-description">
          <h3>Why Learn New Skills?</h3>
          <p>
            In today's world, learning new skills is more important than ever. It opens up opportunities to grow both personally and professionally.
            Whether you're looking to master a new language, learn how to code, or improve your cooking, there's something here for everyone.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
