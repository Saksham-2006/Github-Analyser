const mongoose = require("mongoose");

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    repositories: {
      type: Number,
      default: 0,
    },

    totalStars: {
      type: Number,
      default: 0,
    },

    totalForks: {
      type: Number,
      default: 0,
    },

    languageCount: {
      type: Number,
      default: 0,
    },

    totalCommits: {
      type: Number,
      default: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    languages: [
      {
        language: String,
        percentage: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AnalyticsSnapshot",
  analyticsSnapshotSchema
);