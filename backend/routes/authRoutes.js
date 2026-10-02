

const express = require("express");

const router = express.Router();

const {signup , login,userDetail}= require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");


router.post("/signup",signup);
router.post("/login",login);
router.put("/userdetail",authMiddleware,userDetail);


module.exports = router;