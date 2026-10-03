

const express = require("express");
const router = express.Router();

const swipeUser = require("../controllers/swipeController");
const discoverUser = require("../controllers/discoverController")
const authMiddleware = require("../middleware/authMiddleware");

router.post("/swipeuser",authMiddleware,swipeUser);
router.get("/discover",authMiddleware,discoverUser);


module.exports = router;