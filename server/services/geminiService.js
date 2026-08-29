const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateChatResponse = async (message) => {
  if (!message?.trim()) {
    throw new Error("Message is required");
  }

  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: message,
});

  return response.text;
};

module.exports = {
  generateChatResponse,
};