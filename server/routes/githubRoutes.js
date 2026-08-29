const express = require("express");
const {
  getUser,
  getDashboard,
  getRepositories,
  getActivity,
} = require("../services/githubService");

const Profile = require("../models/Profile");
const AnalyticsSnapshot = require("../models/AnalyticsSnapshot");

const router = express.Router();

// Helper to handle async route errors cleanly
function errorHandler(res, error) {
  console.error("GitHub API error:", error.message);
  const status = error.status || 500;
  const code = error.code || "INTERNAL_ERROR";
  let message = error.message || "Something went wrong";

  if (status === 403 || code === "RATE_LIMITED") {
    message = "GitHub API rate limit reached. Please try again later.";
  } else if (status === 404 || code === "NOT_FOUND") {
    message = "GitHub user not found.";
  }

  res.status(status).json({
    success: false,
    code,
    message,
  });
}

// Save profile + analytics snapshot to MongoDB (fire-and-forget, never blocks the response)
async function persistSnapshot(dashboardData) {
  try {
    const { profile, stats, languages } = dashboardData;

    // Require numeric githubId — skip if not present (e.g. REST fallback)
    if (!profile.id) return;

    // Upsert Profile by githubId
    const savedProfile = await Profile.findOneAndUpdate(
      { githubId: profile.id },
      {
        githubId: profile.id,
        username: profile.login,
        name: profile.name || profile.login,
        avatarUrl: profile.avatar_url,
        bio: profile.bio || "",
        location: profile.location || "",
        profileUrl: profile.html_url,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    // Check if the latest snapshot is identical to prevent spam
    const lastSnapshot = await AnalyticsSnapshot.findOne({ profileId: savedProfile._id })
      .sort({ createdAt: -1 })
      .lean();

    const newRepos = stats.repositories || 0;
    const newStars = stats.totalStars || 0;
    const newForks = stats.totalForks || 0;
    const newCommits = stats.totalCommits || 0;
    const newCurrentStreak = stats.currentStreak || 0;
    const newLongestStreak = stats.longestStreak || 0;
    const newLangCount = stats.languageCount || 0;

    if (lastSnapshot) {
      const isIdentical = 
        lastSnapshot.repositories === newRepos &&
        lastSnapshot.totalStars === newStars &&
        lastSnapshot.totalForks === newForks &&
        lastSnapshot.totalCommits === newCommits &&
        lastSnapshot.currentStreak === newCurrentStreak &&
        lastSnapshot.longestStreak === newLongestStreak &&
        lastSnapshot.languageCount === newLangCount;

      if (isIdentical) {
        return; // Data hasn't changed, skip creating a new snapshot
      }
    }

    // Create a new analytics snapshot because data has changed or it's the first time
    await AnalyticsSnapshot.create({
      profileId: savedProfile._id,
      repositories: stats.repositories || 0,
      totalStars: stats.totalStars || 0,
      totalForks: stats.totalForks || 0,
      totalCommits: stats.totalCommits || 0,
      currentStreak: stats.currentStreak || 0,
      longestStreak: stats.longestStreak || 0,
      languageCount: stats.languageCount || 0,
      languages: (languages || []).map((l) => ({
        language: l.language,
        percentage: l.percentage,
      })),
    });
  } catch (err) {
    // Non-fatal — log but don't crash the request
    console.error("persistSnapshot error:", err.message);
  }
}

// 1. Get basic user profile (backward compatibility)
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await getUser(username);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// 2. Get full dashboard payload — also persists Profile + AnalyticsSnapshot
router.get("/:username/dashboard", async (req, res) => {
  const { username } = req.params;
  const forceRefresh = req.query.fresh === "true";

  try {
    const dashboardData = await getDashboard(username, forceRefresh);

    // Persist to MongoDB (non-blocking — response is not delayed)
    persistSnapshot(dashboardData);

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// 3. Get repositories list and repository aggregate stats
router.get("/:username/repos", async (req, res) => {
  const { username } = req.params;

  try {
    const reposData = await getRepositories(username);
    res.json({
      success: true,
      data: reposData,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// 4. Get detailed activity data
router.get("/:username/activity", async (req, res) => {
  const { username } = req.params;

  try {
    const activityData = await getActivity(username);
    res.json({
      success: true,
      data: activityData,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

// 5. Get analytics history for a username (newest first)
router.get("/:username/history", async (req, res) => {
  const { username } = req.params;

  try {
    const profile = await Profile.findOne({
      username: username.toLowerCase().trim(),
    });

    if (!profile) {
      return res.json({ success: true, data: [] });
    }

    const snapshots = await AnalyticsSnapshot.find({ profileId: profile._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const data = snapshots.map((s) => ({
      date: s.createdAt.toISOString().split("T")[0],
      repositories: s.repositories,
      stars: s.totalStars,
      forks: s.totalForks,
      commits: s.totalCommits,
      currentStreak: s.currentStreak,
      longestStreak: s.longestStreak,
      languageCount: s.languageCount,
      languages: s.languages,
      createdAt: s.createdAt,
    }));

    res.json({ success: true, data });
  } catch (error) {
    errorHandler(res, error);
  }
});

// 6. Compare two GitHub users
router.get("/compare/:username1/:username2", async (req, res) => {
  const { username1, username2 } = req.params;
  const forceRefresh = req.query.fresh === "true";

  try {
    // Fetch both users concurrently to minimize latency
    const [user1Data, user2Data] = await Promise.all([
      getDashboard(username1, forceRefresh),
      getDashboard(username2, forceRefresh)
    ]);

    // Persist to MongoDB (non-blocking)
    persistSnapshot(user1Data);
    persistSnapshot(user2Data);

    res.json({
      success: true,
      data: {
        user1: user1Data,
        user2: user2Data
      },
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

module.exports = router;