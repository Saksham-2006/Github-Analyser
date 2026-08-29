const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const githubRoutes = require("./routes/githubRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
connectDB();

const PORT = process.env.PORT || 5000;

// Allow requests from the deployed frontend or localhost in dev
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
  })
);
app.use(express.json());

app.use("/api/github", githubRoutes);
app.use("/api/profiles", profileRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "GitHub Analyzer API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});