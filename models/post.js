const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required"],
    maxlength: [20, "Max length can be 20 characters"],
    trim: true,
  },
  location: {
    type:Object,
    required: [true, "Location required"],
    place: { 
      type: String, 
      required: [true, "Place required"]
    },
    lat: { 
      type: Number, 
      required: [true, "Latitude required"]
    },
    lang: { 
      type: Number, 
      required: [true, "Longitude required"]
    },
  },
  description: {
    type: String,
    required: [true, "Descirption required"],
    maxlength: [50, "Max length can be 50 characters"],
    trim: true,
  },
  estimated_budget: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: "categories",
    requierd: true,
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  responses: {
    type: [
      {
        worker: {
          type: mongoose.Schema.ObjectId,
          ref: "workers",
          required: true,
        },
        quotation_amnt: {
          type: Number,
          requred: true,
        },
        selected: {
          type: Boolean,//should be enum selected rejected noActiontaken
          default: false,
        },
        additional_msg: {
          type: String,
          required: false,
          default: null,
        },
      },
    ],
    default: [],
  },
  winner: {
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: "workers",
      default: null,
    },
    quotation_amnt: {
      type: Number,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);