# 📘 Sudoku Game (React + State Management)

## Live Demo
Render Deployment: https://sudoku-react-qv9m.onrender.com  
GitHub Repository: https://github.com/YuchenLi27/yuchen-li-project2   

## Overview

This project is a single-player Sudoku game built with React, React Router, and Context API (useReducer) for state management.

## The application supports two difficulty levels:

Easy (6×6 board)
Normal (9×9 board)

Users can play Sudoku with real-time validation, timer tracking, and additional features such as hints and persistent state.

### Features
Core Gameplay
Two game modes:
Easy (6×6)
Normal (9×9)

Pre-filled cells (givens) based on difficulty
Editable cells for user input
Input validation (only valid number ranges allowed)
Invalid moves are highlighted
Game completion detection
Board locks after completion
“Congratulations” message displayed upon success

### Game Controls
New Game → generates a new puzzle
Reset → resets current board to initial state
Timer → tracks elapsed time during gameplay

### Navigation Pages
/ → Home page
/games → Game selection page
/games/easy → Easy mode
/games/normal → Normal mode
/rules → Game rules + credits
/scores → Mock leaderboard
/login → Mock login form
/register → Mock registration form

### UI & Styling
Responsive layout
Visual differentiation for:
Locked cells
Invalid cells
Hint cells
Clean and consistent page structure using layout + navbar
Tech Stack
React (Vite)
React Router
Context API + useReducer
JavaScript (ES6+)
CSS (custom styling)

### Project Structure
src/
  components/
    Navbar.jsx
    Layout.jsx
    SudokuBoard.jsx
    SudokuCell.jsx
    Timer.jsx

  pages/
    HomePage.jsx
    GamesPage.jsx
    EasyGamePage.jsx
    NormalGamePage.jsx
    RulesPage.jsx
    ScoresPage.jsx
    LoginPage.jsx
    RegisterPage.jsx

  context/
    GameContext.jsx

  utils/
    puzzles.js

  styles/
    global.css

## State Management

This project uses React Context + useReducer to manage global game state.

State includes:
mode
initialBoard
currentBoard
solution
invalidCells
isComplete
elapsedTime
hintCell
Actions include:
START_GAME
UPDATE_CELL
RESET_GAME
TICK
SET_HINT
CLEAR_HINT

All logic related to state transitions is centralized in:

src/context/GameContext.jsx
How to Run Locally
git clone https://github.com/YuchenLi27/yuchen-li-project2.git
cd yuchen-li-project2
npm install
npm run dev


# 📝 Writeup
### 1. What challenges did you face?

One of the main challenges was implementing a valid Sudoku generator instead of using pre-defined puzzles.
Ensuring that each generated puzzle has exactly one unique solution required combining backtracking with a solution-counting mechanism.

Another challenge was managing global state cleanly. Initially, it was tempting to store state inside components, but this quickly became unmanageable. Refactoring everything into a Context + reducer architecture improved maintainability but required careful planning of actions and state structure.

Handling validation (highlighting invalid cells dynamically) was also non-trivial, since each input needed to be checked against row, column, and sub-grid constraints.

### 2. If you had more time, what would you improve?

If given more time, I would:

Improve UI/UX:
Add better animations and transitions
Improve mobile responsiveness further
Add advanced gameplay features:
Difficulty scaling beyond easy/normal
Pencil marks (candidate numbers)
Improve performance of puzzle generation
Add real authentication and persistent leaderboard
Write unit tests for core logic (especially puzzle generation)

### 3. What assumptions did you make?
Users will input only numeric values (validated in input field)
Easy mode uses a smaller board (6×6) instead of standard 9×9
Scores page and authentication pages are mock implementations
Timer runs continuously once a game starts
### 4. How long did you spend on this project?

Approximately 50 hours, including:

Designing architecture
Implementing puzzle generation
Building UI components
Debugging and refining state management
### 5. Bonus Features Implemented


## ✅ Bonus 1: Local Storage

The game state is saved to localStorage so that progress persists after refresh.

Implementation:

File: src/context/GameContext.jsx
Functions:
loadSavedState()
localStorage.setItem(...)
localStorage.removeItem(...)
## ✅ Bonus 2: Backtracking with Unique Solution

The Sudoku board is generated dynamically using backtracking.

Implementation:

File: src/utils/puzzles.js
Key functions:
fillBoard() → generate full solution
countSolutions() → ensure uniqueness
createPuzzleFromSolution() → remove numbers safely
generateGame() → full pipeline
## ✅ Bonus 3: Hint System

Provides a hint by identifying a correct value for an incorrect or empty cell.

Implementation:

File: src/context/GameContext.jsx
Function: findHintCell()
State: hintCell
UI: Highlighted in SudokuCell.jsx


## Final Notes

This project demonstrates:

Proper use of React architecture
Clean separation of concerns
Implementation of non-trivial algorithms
Practical state management with Context API