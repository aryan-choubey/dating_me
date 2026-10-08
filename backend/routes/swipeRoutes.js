

const express = require("express");
const router = express.Router();

const discoverUser = require("../controllers/discoverController")
const authMiddleware = require("../middleware/authMiddleware");

const {
  swipeUser,
  getReceivedLikes,
  getSentLikes
} = require("../controllers/swipeController");


router.post("/swipeuser",authMiddleware,swipeUser);
router.get("/getlikes",authMiddleware,getReceivedLikes)
router.get("/sentlikes",authMiddleware,getSentLikes);
router.get("/discover",authMiddleware,discoverUser);


module.exports = router;