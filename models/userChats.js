const mongoose = require("mongoose");

const userChatsSchema = mongoose.Schema({
  user_id: { type: String, required: true },
  chat_rooms: { type: [String], default: [] },
});

module.exports = mongoose.model("userChats", userChatsSchema);
