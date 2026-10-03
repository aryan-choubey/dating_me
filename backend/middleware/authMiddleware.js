const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    
    // console.log("decoded:", decoded);
// console.log("decoded userId:", decoded.userId);
    const user = await User.findById(decoded.userId);
// console.log("found user:", user);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    req.user = user;

    next();

  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;