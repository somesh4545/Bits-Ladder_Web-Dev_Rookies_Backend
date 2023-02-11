const mongoose = require("mongoose");

const PairingSchema = mongoose.Schema({
  worker: {
    type: mongoose.Schema.ObjectId,
    ref: "workers",
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true,
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pairing", PairingSchema);
