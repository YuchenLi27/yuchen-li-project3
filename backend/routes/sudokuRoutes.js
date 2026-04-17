import express from "express";
import SudokuGame from "../models/SudokuGame.js";
import User from "../models/User.js";
import { generateGameName } from "../utils/gameName.js";
import { createSudokuGameData } from "../utils/sudokuGenerator.js";

const router = express.Router();

const formatGameResponse = (game) => {
  return {
    _id: game._id,
    name: game.name,
    difficulty: game.difficulty,
    createdBy: game.createdBy,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
    board: game.board,
    initialBoard: game.initialBoard,
    solution: game.solution,
    completedBy: game.completedBy,
    elapsedSeconds: game.elapsedSeconds ?? 0,
  };
};

router.get("/", async (req, res) => {
  try {
    const games = await SudokuGame.find({})
      .sort({ createdAt: -1 })
      .select("name difficulty createdBy createdAt updatedAt elapsedSeconds");

    return res.json({
      success: true,
      games,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch games",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const username = req.cookies?.username;

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to create a game",
      });
    }

    const { difficulty } = req.body;
    const normalizedDifficulty = difficulty === "EASY" ? "EASY" : "NORMAL";

    const sudokuData = createSudokuGameData(normalizedDifficulty);

    let name = "";
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      const candidateName = generateGameName();
      const existingGame = await SudokuGame.findOne({ name: candidateName });

      if (!existingGame) {
        name = candidateName;
        break;
      }

      attempts += 1;
    }

    if (!name) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate a unique game name. Please try again.",
      });
    }

    const newGame = await SudokuGame.create({
      name,
      difficulty: sudokuData.difficulty,
      createdBy: username,
      board: sudokuData.board,
      initialBoard: sudokuData.initialBoard,
      solution: sudokuData.solution,
      completedBy: [],
      elapsedSeconds: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Game created successfully",
      gameId: newGame._id,
      game: formatGameResponse(newGame),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A game with this generated name already exists. Please try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create game",
    });
  }
});

router.get("/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    return res.json({
      success: true,
      game: formatGameResponse(game),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch game",
    });
  }
});

router.put("/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;
    const { board, completedBy, elapsedSeconds } = req.body;

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (Array.isArray(board)) {
      game.board = board;
    }

    if (Array.isArray(completedBy)) {
      game.completedBy = completedBy;
    }

    if (
      typeof elapsedSeconds === "number" &&
      Number.isFinite(elapsedSeconds) &&
      elapsedSeconds >= 0
    ) {
      game.elapsedSeconds = Math.floor(elapsedSeconds);
    }

    await game.save();

    return res.json({
      success: true,
      message: "Game updated successfully",
      game: formatGameResponse(game),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update game",
    });
  }
});

router.delete("/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;
    const username = req.cookies?.username;

    const game = await SudokuGame.findById(gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to delete a game",
      });
    }

    if (game.createdBy !== username) {
      return res.status(403).json({
        success: false,
        message: "Only the creator can delete this game",
      });
    }

    const completedUsers = Array.isArray(game.completedBy) ? game.completedBy : [];

    if (completedUsers.length > 0) {
      await User.updateMany(
        {
          username: { $in: completedUsers },
          wins: { $gt: 0 },
        },
        {
          $inc: { wins: -1 },
        }
      );
    }

    await SudokuGame.findByIdAndDelete(gameId);

    return res.json({
      success: true,
      message: "Game deleted successfully",
      adjustedUsers: completedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete game",
    });
  }
});

export default router;