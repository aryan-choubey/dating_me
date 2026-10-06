
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const setupSocket = require("./socket/socket");

dotenv.config();

const http = require("http");


const {Server} = require("socket.io");

const app = require("./app");

connectDB();





//create htp server
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173",
        
        credentials: true
    }
});



setupSocket(io);

server.listen(5000, ()=>{
    console.log("server is running on port 5000 ");
});
