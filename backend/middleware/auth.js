import User from "../models/User.js";

const requireAuth = async (req, res, next) => {
  try {
    const username = req.cookies?.username;

    if (!username) {
      return res.status(401).json({ message: "You must be logged in" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid login session" });
    }

    req.user = {
      username: user.username,
      userId: user._id,
    };

    next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication check failed" });
  }
};

export default requireAuth;