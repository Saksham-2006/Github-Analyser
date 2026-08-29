const express = require("express");

const {
  generateChatResponse,
} = require("../services/geminiService");
const { getDashboard } = require("../services/githubService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, username } = req.body;
    let contextData = null;

    if (username) {
      try {
        contextData = await getDashboard(username, false);
      } catch (err) {
        console.warn(`Could not fetch context for ${username}:`, err.message);
      }
    }

    const reply = await generateChatResponse(message, contextData);

    res.json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error("GEMINI ERROR:");
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;