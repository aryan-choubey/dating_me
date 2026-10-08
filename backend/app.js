

const express = require("express");
const errorMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");


const app  = express();

// API CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

// Middleware
app.use(express.json());
app.use(cookieParser());


// Serve uploaded images
// ===============================
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);
console.log("Uploads path:", path.join(__dirname, "uploads"));

const authRoutes  = require("./routes/authRoutes")
const swipeRoutes = require("./routes/swipeRoutes");
const messageRoutes = require("./routes/messageRoutes");
const matchRoutes = require("./routes/matchRoutes")

//routes
app.use("/api/auth",authRoutes);
app.use("/api/swipe",swipeRoutes);
app.use("/api/match",matchRoutes);

app.use("/api/message",messageRoutes);

//errormiddleware
app.use(errorMiddleware)

module.exports = app;