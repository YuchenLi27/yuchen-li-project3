import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const COOKIE_NAME = "username";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get("/isLoggedIn", async (req, res) => {
  try {
    const username = req.cookies?.[COOKIE_NAME];

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    const user = await User.findOne({ username }).select("username wins");

    if (!user) {
      res.clearCookie(COOKIE_NAME);
      return res.status(401).json({
        success: false,
        message: "Invalid session",
      });
    }

    return res.json({
      success: true,
      username: user.username,
      wins: user.wins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while checking login status",
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const trimmedUsername = username.trim();

    if (trimmedUsername.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters long",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ username: trimmedUsername });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: trimmedUsername,
      password: hashedPassword,
    });

    res.cookie(COOKIE_NAME, newUser.username, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      username: newUser.username,
      wins: newUser.wins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while registering user",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const trimmedUsername = username.trim();

    const user = await User.findOne({ username: trimmedUsername });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.cookie(COOKIE_NAME, user.username, cookieOptions);

    return res.json({
      success: true,
      message: "Login successful",
      username: user.username,
      wins: user.wins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while logging in",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;