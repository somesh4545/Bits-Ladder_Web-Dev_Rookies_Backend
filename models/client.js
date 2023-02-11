const mongoose = require("mongoose");
const validator = require("validator");

const ClientSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
    maxlength: [20, "Max length can be 20 characters"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    maxlength: [10, "Max length can be 10"],
    minlength: [10, "Min length can be 10"],
    trim: true,
    unique: true,
  },
  phone_verified: {
    type: Boolean,
    default: true,
  },
  email: {
    type: String,
    required: false,
    validate: [validator.isEmail, "Please Enter a valid Email"],
    index: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isBlackListed: {
    type: Boolean,
    default: false,
    required: false,
  },
});

module.exports = mongoose.model("Client", ClientSchema);
