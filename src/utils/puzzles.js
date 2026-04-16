function deepCopyBoard(board) {
  return board.map((row) => [...row])
}

function shuffleArray(array) {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function getConfig(mode) {
  if (mode === 'easy') {
    return {
      size: 6,
      digits: [1, 2, 3, 4, 5, 6],
      subRows: 2,
      subCols: 3,
      givens: 18,
    }
  }

  return {
    size: 9,
    digits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    subRows: 3,
    subCols: 3,
    givens: 29,
  }
}

function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(0))
}

function isValidPlacement(board, row, col, value, subRows, subCols) {
  const size = board.length

  for (let c = 0; c < size; c += 1) {
    if (c !== col && board[row][c] === value) {
      return false
    }
  }

  for (let r = 0; r < size; r += 1) {
    if (r !== row && board[r][col] === value) {
      return false
    }
  }

  const startRow = Math.floor(row / subRows) * subRows
  const startCol = Math.floor(col / subCols) * subCols

  for (let r = startRow; r < startRow + subRows; r += 1) {
    for (let c = startCol; c < startCol + subCols; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return false
      }
    }
  }

  return true
}

function findEmptyCell(board) {
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] === 0) {
        return { row, col }
      }
    }
  }

  return null
}

function fillBoard(board, digits, subRows, subCols) {
  const emptyCell = findEmptyCell(board)

  if (!emptyCell) {
    return true
  }

  const { row, col } = emptyCell
  const shuffledDigits = shuffleArray(digits)

  for (const digit of shuffledDigits) {
    if (!isValidPlacement(board, row, col, digit, subRows, subCols)) {
      continue
    }

    board[row][col] = digit

    if (fillBoard(board, digits, subRows, subCols)) {
      return true
    }

    board[row][col] = 0
  }

  return false
}

function generateSolvedBoard(mode) {
  const { size, digits, subRows, subCols } = getConfig(mode)

  while (true) {
    const board = createEmptyBoard(size)
    const success = fillBoard(board, digits, subRows, subCols)

    if (success) {
      return board
    }
  }
}

function countSolutions(board, mode, limit = 2) {
  const { digits, subRows, subCols } = getConfig(mode)
  const workingBoard = deepCopyBoard(board)
  let solutionCount = 0

  function solve() {
    if (solutionCount >= limit) {
      return
    }

    const emptyCell = findEmptyCell(workingBoard)

    if (!emptyCell) {
      solutionCount += 1
      return
    }

    const { row, col } = emptyCell

    for (const digit of digits) {
      if (!isValidPlacement(workingBoard, row, col, digit, subRows, subCols)) {
        continue
      }

      workingBoard[row][col] = digit
      solve()
      workingBoard[row][col] = 0

      if (solutionCount >= limit) {
        return
      }
    }
  }

  solve()
  return solutionCount
}

function createPuzzleFromSolution(solution, mode) {
  const { size, givens } = getConfig(mode)
  const puzzle = deepCopyBoard(solution)
  const totalCells = size * size
  const targetRemovals = totalCells - givens

  const indices = shuffleArray(
    Array.from({ length: totalCells }, (_, index) => index)
  )

  let removedCount = 0

  for (const index of indices) {
    if (removedCount >= targetRemovals) {
      break
    }

    const row = Math.floor(index / size)
    const col = index % size
    const savedValue = puzzle[row][col]

    puzzle[row][col] = 0

    const solutionCount = countSolutions(puzzle, mode, 2)

    if (solutionCount !== 1) {
      puzzle[row][col] = savedValue
    } else {
      removedCount += 1
    }
  }

  return puzzle
}

export function getRandomPuzzle(mode) {
  const solution = generateSolvedBoard(mode)
  const puzzle = createPuzzleFromSolution(solution, mode)

  return {
    puzzle: deepCopyBoard(puzzle),
    solution: deepCopyBoard(solution),
  }
}