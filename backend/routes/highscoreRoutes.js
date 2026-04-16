import express from "express";
import User from "../models/User.js";
import SudokuGame from "../models/SudokuGame.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find({ wins: { $gt: 0 } })
      .sort({ wins: -1, username: 1 })
      .select("username wins");

    return res.json({
      success: true,
      highscores: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch highscores",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { gameId } = req.body;
    const username = req.cookies?.username;

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to record a high score",
      });
    }

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: "gameId is required",
      });
    }

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (!game.completedBy.includes(username)) {
      game.completedBy.push(username);
      await game.save();

      await User.findOneAndUpdate(
        { username },
        { $inc: { wins: 1 } },
        { new: true }
      );
    }

    const user = await User.findOne({ username }).select("username wins");

    return res.json({
      success: true,
      message: "High score updated",
      username: user?.username,
      wins: user?.wins ?? 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update high score",
    });
  }
});

router.get("/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await SudokuGame.findById(gameId).select("name completedBy");

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    return res.json({
      success: true,
      gameId,
      gameName: game.name,
      completedBy: game.completedBy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch game high score",
    });
  }
});

export default router;