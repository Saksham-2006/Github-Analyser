const express = require("express");
const {
  getUser,
  getDashboard,
  getRepositories,
  getActivity,
} = require("../services/githubService");

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

// 2. Get full dashboard payload (profile, stats, languages, recentActivity, contributions, trends)
router.get("/:username/dashboard", async (req, res) => {
  const { username } = req.params;

  try {
    const dashboardData = await getDashboard(username);
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

module.exports = router;