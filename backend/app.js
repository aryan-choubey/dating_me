

const express = require("express");
const errorMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");


const app  = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const authRoutes  = require("./routes/authRoutes")
const swipeRoutes = require("./routes/swipeRoutes");


//routes
app.use("/api/auth",authRoutes);
app.use("/api/swipe",swipeRoutes);

//errormiddleware
app.use(errorMiddleware)

module.exports = app;