

const express = require("express");

const router = express.Router();

const {signup , login,userDetail}= require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multterMiddleware");


router.post("/signup",signup);
router.post("/login",login);
router.put("/userdetail",authMiddleware,  upload.array("photos", 4),userDetail);


module.exports = router;