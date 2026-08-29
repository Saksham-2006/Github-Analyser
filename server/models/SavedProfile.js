const mongoose = require("mongoose");

const savedProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    githubId: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      default: "",
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    profileUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SavedProfile", savedProfileSchema);
