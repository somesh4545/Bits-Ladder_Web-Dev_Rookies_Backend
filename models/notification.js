const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required"],
    maxlength: [50, "Max length can be 50 characters"],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [100, "Max length can be 100 characters"],
    trim: true,
    default: null,
  },
  userType: {
    type: String,
    enum: ["Client", "Worker"],
    default: "Client",
  },
  userID: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
