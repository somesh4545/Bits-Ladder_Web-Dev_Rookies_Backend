const mongoose = require("mongoose");

const experience = mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const WorkersSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of worker is required"],
    maxlength: [20, "Max length can be 20 characters"],
    trim: true,
  },
  phone_no: {
    type: String,
    required: [true, "Phone number is required"],
    maxlength: [10, "Max length can be 10"],
    minlength: [10, "Min length can be 10"],
    trim: true,
  },
  phone_verified: {
    type: Boolean,
    default: false,
  },
  aadhar_id: {
    type: String,
    required: [true, "Aadhar ID is required"],
    maxlength: [12, "Max length can be 10"],
    minlength: [12, "Min length can be 10"],
    trim: true,
  },
  aadhar_card_url: {
    type: String,
    required: [true, "Aadhar Card URL is required"],
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  blacklist: {
    type: Boolean,
    default: false,
  },
  experiences: {
    type: [experience],
    default: [],
  },
  rating: {
    total: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  plan: {
    plan_type: {
      type: String,
      default: null,
    },
    amount: {
      type: String,
      default: null,
    },
    mode: {
      type: String,
      default: null,
    },
    ref_id: {
      type: String,
      default: null,
    },
    date: {
      default: Date.now(),
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("workers", WorkersSchema);
