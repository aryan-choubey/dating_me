

const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
    {
     
        users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    matchedAt: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,

    });

    const Match =  mongoose.model("Match",matchSchema);
   module.exports = Match;