const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateChatResponse = async (message, contextData = null) => {
  if (!message?.trim()) {
    throw new Error("Message is required");
  }

  let prompt = message;
  if (contextData) {
    prompt = `You are a helpful GitHub AI assistant. The user is currently viewing the GitHub profile of ${contextData.profile?.login}. Here is their data:\n\n${JSON.stringify({ profile: contextData.profile, stats: contextData.stats, languages: contextData.languages }, null, 2)}\n\nUser Question: ${message}`;
  }

  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: prompt,
});

  return response.text;
};

module.exports = {
  generateChatResponse,
};