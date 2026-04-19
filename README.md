# Sudoku Fullstack App

A full-stack Sudoku web application built with React, Vite, Express, MongoDB, and Mongoose.

## Live Demo
- Deployed link: https://sudoku-backend-qnh4.onrender.com
- GitHub Repository: https://github.com/YuchenLi27/yuchen-li-project3

## Overview

This project is a full-stack Sudoku game that allows users to register, log in, create games, continue saved games, track time, and view a persistent high score leaderboard.

The app supports:
- Easy mode (6×6 board)
- Normal mode (9×9 board)

Unlike the previous frontend-only version, this project stores users, games, progress, and wins in MongoDB. Authentication is handled with cookies, and the frontend communicates with backend REST APIs.

## Features

### Core Gameplay
- Easy (6×6) and Normal (9×9) Sudoku modes
- Pre-filled cells based on difficulty
- Editable cells for user input
- Real-time conflict highlighting
- Game completion detection
- Reset game functionality
- Timer tracking during gameplay
- Progress auto-save while playing

### User System
- Register with username and password
- Log in with username and password
- Cookie-based authentication
- Log out
- Logged-in users can create games and save progress

### Game Management
- Create a new Sudoku game from the selection page
- Load and continue existing games
- Each game has:
  - a unique generated name
  - difficulty
  - creator username
  - creation date
- Delete a game if you are the creator

### High Scores
- Persistent leaderboard stored in MongoDB
- Wins are recorded when a logged-in user completes a game
- Scores are sorted from most wins to least wins

## Pages

- `/` → Home page
- `/games` → Game selection page
- `/game/:gameId` → Play a specific game
- `/rules` → Rules and credits page
- `/scores` → High score leaderboard
- `/login` → Login page
- `/register` → Register page

## Tech Stack

### Frontend
- React
- Vite
- React Router
- JavaScript
- CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- cookie-parser
- bcryptjs
- cors
- dotenv

## Project Structure

```txt
yuchen-li-project3/
├── backend/
│   ├── middleware/
│   ├── models/
│   │   ├── SudokuGame.js
│   │   └── User.js
│   ├── routes/
│   │   ├── highscoreRoutes.js
│   │   ├── sudokuRoutes.js
│   │   └── userRoutes.js
│   └── utils/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Timer.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── GamePage.jsx
│   │   ├── GamesPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RulesPage.jsx
│   │   └── ScoresPage.jsx
│   └── styles/
├── server.js
├── package.json
└── README.md

REST API Summary
User APIs
GET /api/user/isLoggedIn
POST /api/user/login
POST /api/user/register
POST /api/user/logout
Sudoku APIs
GET /api/sudoku
POST /api/sudoku
GET /api/sudoku/:gameId
PUT /api/sudoku/:gameId
DELETE /api/sudoku/:gameId
High Score APIs
GET /api/highscore
POST /api/highscore
GET /api/highscore/:gameId

Local Development
1. Clone the repo
git clone https://github.com/YuchenLi27/yuchen-li-project3.git

2. Install dependencies
npm install

3. Create a local .env file
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/sudoku_project3
CLIENT_URL=http://localhost:5173

4. Start the backend
npm run server

5. Start the frontend
npm run dev

Writeup
1. What challenges did you face while making this app?

One major challenge was upgrading a frontend-only Sudoku project into a full-stack application. This required redesigning how game state was handled so that progress, completed games, user accounts, and high scores could persist in MongoDB instead of only existing in React state.

Another challenge was integrating authentication cleanly. I needed to support registration, login, logout, and cookie-based session checks while keeping the frontend and backend consistent. I also had to debug issues caused by migrating from old project2 components into a new project3 architecture.

A third challenge was preserving gameplay quality while adding backend persistence. Features such as timer tracking, conflict highlighting, reset behavior, auto-save, leaderboard updates, and delete-game logic all had to work together without breaking the Sudoku experience.

2. Given more time, what additional features or design changes would you make?

If I had more time, I would improve the visual polish of the app, especially animations, responsive layout details, and more refined styling for the game board and forms.

I would also add richer gameplay features such as pencil marks, multiple saved sessions per user, more difficulty levels, and a custom puzzle creation mode.

On the backend side, I would add stronger admin tooling, more validation, better error handling, and automated tests for authentication, Sudoku APIs, and leaderboard logic.

3. What assumptions did you make while working on this assignment?

I assumed that users must be logged in to create new games and save named progress. I also assumed that a 6×6 version is acceptable as the easy mode while 9×9 serves as the normal mode.

I assumed that the app should prioritize persistence and usability over advanced multiplayer or social features. I also assumed that the unique generated game name requirement could be satisfied by generating three-word names from a large word list and checking the database for collisions before saving.

4. How long did this assignment take to complete?

Approximately 60–70 hours.

This time included:

refactoring project2 into a project3 full-stack structure
building Express APIs
connecting MongoDB with Mongoose
implementing authentication and cookies
integrating the frontend with backend routes
fixing gameplay regressions during migration
debugging deployment and environment variable issues

5. What bonus points did you accomplish?
Password encryption: user passwords are hashed before being stored in the database

Delete game: creators can delete their own games, and related recorded wins are updated accordingly.

AI Survey.