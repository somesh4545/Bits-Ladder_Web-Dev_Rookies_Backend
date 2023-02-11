const mongoose = require("mongoose");

const chatRoomsSchema = mongoose.Schema({
  users: { type: [String], required: true },
  chats: { type: [String], default: [] },
  lastMsg: { type: String, default: null },
  lastMsgTime: { type: Date, default: Date.now() },
  creator: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("chatRooms", chatRoomsSchema);
