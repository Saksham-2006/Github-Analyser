const express = require("express");
const SavedProfile = require("../models/SavedProfile");

const router = express.Router();

// POST /api/profiles/save
// Body: { username, githubId, name, avatarUrl, profileUrl }
router.post("/save", async (req, res) => {
  const { username, githubId, name, avatarUrl, profileUrl } = req.body;

  if (!username || !githubId) {
    return res.status(400).json({
      success: false,
      message: "username and githubId are required.",
    });
  }

  try {
    // Upsert by username — prevents duplicate saves
    const saved = await SavedProfile.findOneAndUpdate(
      { username: username.toLowerCase().trim() },
      { githubId, name, avatarUrl, profileUrl },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    res.json({ success: true, data: saved });
  } catch (err) {
    console.error("Save profile error:", err.message);
    res.status(500).json({ success: false, message: "Failed to save profile." });
  }
});

// GET /api/profiles/saved
router.get("/saved", async (req, res) => {
  try {
    const profiles = await SavedProfile.find().sort({ createdAt: -1 });
    res.json({ success: true, data: profiles });
  } catch (err) {
    console.error("Fetch saved profiles error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch saved profiles." });
  }
});

// DELETE /api/profiles/saved/:username
router.delete("/saved/:username", async (req, res) => {
  const { username } = req.params;

  try {
    await SavedProfile.deleteOne({ username: username.toLowerCase().trim() });
    res.json({ success: true, message: "Profile removed." });
  } catch (err) {
    console.error("Delete saved profile error:", err.message);
    res.status(500).json({ success: false, message: "Failed to remove profile." });
  }
});

module.exports = router;
