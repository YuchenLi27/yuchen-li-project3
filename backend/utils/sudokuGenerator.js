const solvedBoard9 = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const solvedBoard6 = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 4, 5, 6, 1, 2],
  [6, 1, 2, 3, 4, 5],
];

const deepCopyBoard = (board) => {
  return board.map((row) => [...row]);
};

const shuffleArray = (array) => {
  const copy = [...array];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
};

const removeCells = (board, cellsToRemove) => {
  const nextBoard = deepCopyBoard(board);
  const allPositions = [];

  for (let row = 0; row < nextBoard.length; row += 1) {
    for (let col = 0; col < nextBoard[row].length; col += 1) {
      allPositions.push([row, col]);
    }
  }

  const shuffledPositions = shuffleArray(allPositions);

  for (let index = 0; index < cellsToRemove && index < shuffledPositions.length; index += 1) {
    const [row, col] = shuffledPositions[index];
    nextBoard[row][col] = 0;
  }

  return nextBoard;
};

export const createSudokuGameData = (difficulty) => {
  const normalizedDifficulty = difficulty === "EASY" ? "EASY" : "NORMAL";

  if (normalizedDifficulty === "EASY") {
    const solution = deepCopyBoard(solvedBoard6);
    const initialBoard = removeCells(solution, 12);
    const board = deepCopyBoard(initialBoard);

    return {
      difficulty: "EASY",
      board,
      initialBoard,
      solution,
    };
  }

  const solution = deepCopyBoard(solvedBoard9);
  const initialBoard = removeCells(solution, 45);
  const board = deepCopyBoard(initialBoard);

  return {
    difficulty: "NORMAL",
    board,
    initialBoard,
    solution,
  };
};