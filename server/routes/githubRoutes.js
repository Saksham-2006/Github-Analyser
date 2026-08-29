const express = require("express");

const { getUser } = require("../services/githubService");

const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await getUser(username);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GitHub API error:", error.message);

    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

module.exports = router;