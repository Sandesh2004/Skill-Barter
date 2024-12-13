const express = require("express");
const Notification = require("../models/Notification");
const Profile = require("../models/Profile");
const User = require("../models/User");
const authenticateUser = require("../middleware/authenticateuser"); // Import your authentication middleware

const router = express.Router();

// Request exchange: Send a notification
router.post("/request-exchange", async (req, res) => {
    const { senderId, receiverId, course } = req.body;

    console.log(senderId);
    console.log(receiverId);
    console.log(course);
  
    if (!senderId || !receiverId || !course) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      // Save the notification in the database
      await Notification.create({
        senderId: senderId,  // Corrected to match the schema
        receiverId: receiverId,  // Corrected to match the schema
        message: `You have received a new exchange request for the course: ${course}.`,
        course: course,  // Include the course for context
      });
  
      res.status(201).json({ message: "Exchange request sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to send exchange request" });
    }
  });
  
  

// Fetch notifications for a user
router.get("/notifications", authenticateUser, async (req, res) => {
    const userId = req.userId; // Using req.userId from the authentication middleware
  
    try {
      const notifications = await Notification.find({ receiverId: userId })
        .populate("senderId", "username") // Populate sender details
        .sort({ createdAt: -1 });
  
      res.json(notifications);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
// Accept an exchange request
router.post("/notifications/accept", async (req, res) => {
    const { notificationId } = req.body;

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Update the status of the notification to 'Accepted'
        notification.status = "Accepted";
        await notification.save();

        // Fetch the receiver's details to get their name or username
        const receiver = await User.findById(notification.receiverId);
        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        
        const receiverId = notification.senderId;
        

        const user = await User.findById(receiverId);  // Find the user by receiverId
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
        // Create a new notification for the sender to inform them the request was accepted
        const newNotification = new Notification({
            
            senderId: notification.receiverId,  // The receiver becomes the sender of this new notification
            receiverId: notification.senderId,  // The sender becomes the receiver of this new notification
            message: `Youre request was accepted for the course: ${notification.course}`,  // Include receiver's name
            course: notification.course,
            status: "Accepted",  // Set the status of this new notification to 'Accepted'
        });

        await newNotification.save();  // Save the new notification to the database

        // Send a response to the client
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

  

// Reject an exchange request
router.post("/notifications/reject", async (req, res) => {
    const { notificationId } = req.body;
  
    try {
      const notification = await Notification.findById(notificationId);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
  
      // Update the status of the notification to 'Rejected'
      notification.status = "Rejected";
      await notification.save();
  
      // Fetch the receiver's details to get their name or username (same as in accept)
      const receiver = await User.findById(notification.receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" });
      }
      
  
      const receiverId = notification.senderId;
      
  
      const user = await User.findById(receiverId);  // Find the user by receiverId
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Create a new notification for the sender to inform them the request was rejected
      const newNotification = new Notification({
        senderId: notification.receiverId,  // The receiver becomes the sender of this new notification
        receiverId: notification.senderId,  // The sender becomes the receiver of this new notification
        message: `Your request was rejected for the course: ${notification.course}`,  // Message for the sender
        course: notification.course,
        status: "Rejected",  // Set the status of this new notification to 'Rejected'
      });

  
      await newNotification.save();  // Save the new notification to the database
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  


// Route to notify the sender when their request is accepted
router.post("/notifications/notify-sender", async (req, res) => {
    const { senderId, course, receiverId } = req.body;
  
    try {
      // Check if senderId, receiverId, and course are provided
    if (!senderId || !receiverId || !course) {
        return res.status(400).json({ message: "senderId, receiverId, and course are required." });
      }

      // Fetch the sender's details to get their name or username
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
  
      // Create a new notification for the sender that their request was accepted
      const newNotification = new Notification({
        senderId: receiverId,  // The receiver of the request is now the sender of the new notification
        receiverId: senderId,  // The user who sent the original request is now the receiver
        message: `Your request for the course ${course} has been accepted.`,
        course: course,
        status: "Pending",  // The status can be set as per your requirement
      });
  
      await newNotification.save(); // Save the new notification to the database
      res.json({ message: "Notification sent to the sender successfully.", notification: newNotification });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });


 // Route to notify the sender when their request is rejected
router.post("/notifications/notify-sender-reject", async (req, res) => {
    const { senderId, course, receiverId } = req.body;
  
    try {
      // Check if senderId, course, and receiverId are provided
      if (!senderId || !course || !receiverId) {
        return res.status(400).json({ message: "senderId, course, and receiverId are required." });
      }
  
      // Fetch the sender's details to get their name or username
      const sender = await User.findById(senderId);
      if (!sender) {
        return res.status(404).json({ message: "Sender not found" });
      }
  
      // Create a new notification for the sender that their request was rejected
      const newNotification = new Notification({
        senderId: receiverId,  // The receiver becomes the sender of this new notification
        receiverId: senderId,  // The sender becomes the receiver of this new notification
        message: `Your request for the course ${course} has been rejected.`,
        course: course,
        status: "Rejected",  // Set the status of this new notification to 'Rejected'
      });
  
      await newNotification.save(); // Save the new notification to the database
  
      res.json({
        message: "Notification sent to the sender successfully.",
        notification: newNotification,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
  

module.exports = router;
