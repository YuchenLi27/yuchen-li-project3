import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get("/isLoggedIn", async (req, res) => {
  try {
    const username = req.cookies?.username;

    if (!username) {
      return res.status(401).json({
        success: false,
        message: "Not logged in",
      });
    }

    const user = await User.findOne({ username }).select("username wins");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      username: user.username,
      wins: user.wins ?? 0,
    });
  } catch (error) {
    console.error("isLoggedIn error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check login status",
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

    if (!trimmedUsername) {
      return res.status(400).json({
        success: false,
        message: "Username cannot be empty",
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
      wins: 0,
    });

    console.log("Register success, setting cookie for:", newUser.username);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("cookieOptions:", cookieOptions);

    res.cookie("username", newUser.username, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      username: newUser.username,
      wins: newUser.wins,
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register",
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

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log("Login success, setting cookie for:", user.username);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("cookieOptions:", cookieOptions);

    res.cookie("username", user.username, cookieOptions);

    return res.json({
      success: true,
      message: "Logged in successfully",
      username: user.username,
      wins: user.wins ?? 0,
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to log in",
    });
  }
});

router.post("/logout", (req, res) => {
  console.log("Logout, clearing cookie");

  res.clearCookie("username", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;