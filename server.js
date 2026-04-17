import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import connectDB from "./backend/db.js";
import userRoutes from "./backend/routes/userRoutes.js";
import sudokuRoutes from "./backend/routes/sudokuRoutes.js";
import highscoreRoutes from "./backend/routes/highscoreRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

connectDB();

const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    clientUrl: allowedOrigin,
  });
});

app.use("/api/user", userRoutes);
app.use("/api/sudoku", sudokuRoutes);
app.use("/api/highscore", highscoreRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${allowedOrigin}`);
});