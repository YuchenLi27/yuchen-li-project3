import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./backend/db.js";
import userRoutes from "./backend/routes/userRoutes.js";
import sudokuRoutes from "./backend/routes/sudokuRoutes.js";
import highscoreRoutes from "./backend/routes/highscoreRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

  app.use(
    cors({
      origin: allowedOrigin,
      credentials: true,
    })
  );
}

// API routes
app.use("/api/user", userRoutes);
app.use("/api/sudoku", sudokuRoutes);
app.use("/api/highscore", highscoreRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    nodeEnv: process.env.NODE_ENV || "undefined",
  });
});


if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "dist");

  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});