import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import { useNavigate } from "react-router-dom";
import "./Notifications.css"

const Notifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      if (!token) {
        setError("No token found.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Response data:", response.data);
        setNotifications(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch notifications.");
      }
    };

    fetchNotifications();
  }, [token]);

  // Handle viewing a profile
  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  // Handle accepting the request
  const handleAccept = async (notificationId, notification, senderId, course) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      // Accept the exchange request by calling the server's accept endpoint
      await axios.post(
        `http://localhost:5000/api/notifications/notifications/accept`,
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const receiverId = notification.receiverId;

      // Create a new notification for the sender informing them of the acceptance
      await axios.post(
        `http://localhost:5000/api/notifications/notifications/notify-sender`,
        { senderId, course, receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      

      alert(`You have accepted the request for the course: ${course}`);
    } catch (err) {
      setError("Failed to accept the request.");
    }
  };

  // Handle rejecting the request
  const handleReject = async (notificationId, notification, senderId, course) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      // Reject the exchange request by calling the server's reject endpoint
      await axios.post(
        `http://localhost:5000/api/notifications/notifications/reject`,
        { notificationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const receiverId = notification.receiverId; // Get the receiverId from the notification

      // Create a new notification for the sender informing them of the rejection
      await axios.post(
        `http://localhost:5000/api/notifications/notifications/notify-sender-reject`,
        { senderId, course, receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      

      alert(`You have rejected the request for the course: ${course}`);
    } catch (err) {
      console.error(err);
      setError("Failed to reject the request.");
    }
  };

  return (
  <div>
    <Navbar />
    <main className="main-container">
      <div className="content-overlay">
        <h1>Notifications Page</h1>
        <p
          style={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            color: "black",
            marginBottom: "1rem",
          }}
        >
          All your notifications gathered together
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {notifications.length === 0 ? (
          <p>No notifications to display</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification._id} className="notification-card">
              <p>{notification.message}</p>
              <div className="notification-actions">
                {notification.message.includes("accepted") ||
                notification.message.includes("rejected") ? (
                  // Only show the "View Profile" button for accepted/rejected notifications
                  <button
                    onClick={() =>
                      handleViewProfile(notification.senderId._id)
                    }
                    className="view-profile-btn"
                  >
                    View Profile
                  </button>
                ) : (
                  // Show all buttons for pending notifications
                  <>
                    <button
                      onClick={() =>
                        handleViewProfile(notification.senderId._id)
                      }
                      className="view-profile-btn"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() =>
                        handleAccept(
                          notification._id,
                          notification,
                          notification.senderId._id,
                          notification.course
                        )
                      }
                      className="accept-btn"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleReject(
                          notification._id,
                          notification,
                          notification.senderId._id,
                          notification.course
                        )
                      }
                      className="deny-btn"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
    <Footer />
  </div>
);
};

export default Notifications;
