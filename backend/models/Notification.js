const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    course: { 
      type: String, 
      required: true // To specify the course for the exchange request
    },
    status: { 
      type: String, 
      enum: ["Pending", "Accepted", "Rejected"], 
      default: "Pending" 
    },
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Notification", NotificationSchema);
