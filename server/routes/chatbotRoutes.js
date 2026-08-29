const express = require("express");

const {
  generateChatResponse,
} = require("../services/geminiService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const reply = await generateChatResponse(message);

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