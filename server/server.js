const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const githubRoutes = require("./routes/githubRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

connectDB();

const PORT = process.env.PORT || 5000;

// Allow requests from frontend (localhost & production)
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/github", githubRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/chat", chatbotRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "GitHub Analyzer API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});