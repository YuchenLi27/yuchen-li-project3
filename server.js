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

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server is running" });
});

app.use("/api/user", userRoutes);
app.use("/api/sudoku", sudokuRoutes);
app.use("/api/highscore", highscoreRoutes);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();