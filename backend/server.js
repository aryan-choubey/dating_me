
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
connectDB();
app.listen(5000, ()=>{
    console.log("server is running on port 5000 ");
});
