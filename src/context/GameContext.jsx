import { createContext, useContext, useEffect, useReducer } from 'react'
import { getRandomPuzzle } from '../utils/puzzles'

const GameContext = createContext()

const STORAGE_KEY = 'sudoku-game-state'

function cloneBoard(board) {
  return board.map((row) => [...row])
}

function getSubgridSize(mode) {
  if (mode === 'easy') {
    return { subRows: 2, subCols: 3 }
  }
  return { subRows: 3, subCols: 3 }
}

function cellKey(row, col) {
  return `${row}-${col}`
}

function getMaxValue(mode, board) {
  if (mode === 'easy') return 6
  if (mode === 'normal') return 9
  return board.length || 9
}

function getInvalidCells(board, mode) {
  const invalid = new Set()
  const size = board.length
  const { subRows, subCols } = getSubgridSize(mode)

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const value = board[row][col]
      if (value === 0) continue

      for (let otherCol = 0; otherCol < size; otherCol += 1) {
        if (otherCol !== col && board[row][otherCol] === value) {
          invalid.add(cellKey(row, col))
          invalid.add(cellKey(row, otherCol))
        }
      }

      for (let otherRow = 0; otherRow < size; otherRow += 1) {
        if (otherRow !== row && board[otherRow][col] === value) {
          invalid.add(cellKey(row, col))
          invalid.add(cellKey(otherRow, col))
        }
      }

      const startRow = Math.floor(row / subRows) * subRows
      const startCol = Math.floor(col / subCols) * subCols

      for (let r = startRow; r < startRow + subRows; r += 1) {
        for (let c = startCol; c < startCol + subCols; c += 1) {
          if ((r !== row || c !== col) && board[r][c] === value) {
            invalid.add(cellKey(row, col))
            invalid.add(cellKey(r, c))
          }
        }
      }
    }
  }

  return [...invalid]
}

function isBoardComplete(board, solution) {
  if (!board.length || !solution.length) return false

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (board[row][col] !== solution[row][col]) {
        return false
      }
    }
  }

  return true
}

function isValidPlacement(board, mode, row, col, value) {
  const size = board.length
  const { subRows, subCols } = getSubgridSize(mode)

  for (let c = 0; c < size; c += 1) {
    if (c !== col && board[row][c] === value) return false
  }

  for (let r = 0; r < size; r += 1) {
    if (r !== row && board[r][col] === value) return false
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

function findHintCell(board, mode, initialBoard) {
  if (!board.length) return null

  const maxValue = getMaxValue(mode, board)

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      if (initialBoard[row][col] !== 0) continue
      if (board[row][col] !== 0) continue

      const candidates = []

      for (let value = 1; value <= maxValue; value += 1) {
        if (isValidPlacement(board, mode, row, col, value)) {
          candidates.push(value)
        }
      }

      if (candidates.length === 1) {
        return { row, col }
      }
    }
  }

  return null
}

const initialState = {
  mode: 'easy',
  initialBoard: [],
  currentBoard: [],
  solution: [],
  invalidCells: [],
  isComplete: false,
  elapsedTime: 0,
  hintCell: null,
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState

    const parsed = JSON.parse(raw)

    return {
      ...initialState,
      ...parsed,
      hintCell: parsed.hintCell ?? null,
    }
  } catch {
    return initialState
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const { mode } = action.payload
      const { puzzle, solution } = getRandomPuzzle(mode)

      return {
        mode,
        initialBoard: cloneBoard(puzzle),
        currentBoard: cloneBoard(puzzle),
        solution: cloneBoard(solution),
        invalidCells: [],
        isComplete: false,
        elapsedTime: 0,
        hintCell: null,
      }
    }

    case 'UPDATE_CELL': {
      if (state.isComplete) return state

      const { row, col, value } = action.payload
      const nextBoard = cloneBoard(state.currentBoard)
      nextBoard[row][col] = value

      const invalidCells = getInvalidCells(nextBoard, state.mode)
      const isComplete =
        invalidCells.length === 0 && isBoardComplete(nextBoard, state.solution)

      return {
        ...state,
        currentBoard: nextBoard,
        invalidCells,
        isComplete,
        hintCell: null,
      }
    }

    case 'RESET_GAME': {
      const resetBoard = cloneBoard(state.initialBoard)

      return {
        ...state,
        currentBoard: resetBoard,
        invalidCells: [],
        isComplete: false,
        elapsedTime: 0,
        hintCell: null,
      }
    }

    case 'TICK': {
      if (state.isComplete || !state.currentBoard.length) {
        return state
      }

      return {
        ...state,
        elapsedTime: state.elapsedTime + 1,
      }
    }

    case 'SET_HINT': {
      if (state.isComplete) return state

      const hintCell = findHintCell(
        state.currentBoard,
        state.mode,
        state.initialBoard
      )

      return {
        ...state,
        hintCell,
      }
    }

    case 'CLEAR_HINT': {
      return {
        ...state,
        hintCell: null,
      }
    }

    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, loadSavedState)

  useEffect(() => {
    if (!state.currentBoard.length) return

    if (state.isComplete) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  return useContext(GameContext)
}