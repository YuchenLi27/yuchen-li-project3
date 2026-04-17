import mongoose from "mongoose";

const sudokuGameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "NORMAL"],
      required: true,
    },
    createdBy: {
      type: String,
      default: "Guest",
    },
    board: {
      type: [[Number]],
      required: true,
    },
    initialBoard: {
      type: [[Number]],
      required: true,
    },
    solution: {
      type: [[Number]],
      required: true,
    },
    completedBy: {
      type: [String],
      default: [],
    },
    elapsedSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SudokuGame = mongoose.model("SudokuGame", sudokuGameSchema);

export default SudokuGame;