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
  process.env.CLIENT_URL,          // e.g. https://your-app.netlify.app
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
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