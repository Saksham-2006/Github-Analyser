const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    githubId: {
      type: Number,
      required: true,
      unique: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: String,

    avatarUrl: String,

    bio: String,

    location: String,

    profileUrl: String,

    publicRepos: Number,

    followers: Number,

    following: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);