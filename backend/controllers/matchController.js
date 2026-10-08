const Match = require("../models/match.model");


// ==================================
// GET MY MATCHES
// ==================================

const getMatches = async (req, res, next) => {
  try {
   
    const userId = req.user._id;

    const matches = await Match.find({
      $or: [
        { user1: userId },
        { user2: userId }
      ]
    })
      .populate("user1", "-password")
      .populate("user2", "-password")
      .sort({ createdAt: -1 });

    const matchedUsers = matches.map((match) => {

      const matchedUser =
        match.user1._id.toString() === userId.toString()
          ? match.user2
          : match.user1;

      return {
        matchId: match._id,
        user: matchedUser
      };

    });

    res.status(200).json({
      success: true,
      matches: matchedUsers
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getMatches
};