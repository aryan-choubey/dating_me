


const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const socketAuth = async (socket, next) => {

    try{

        const cookieHeader = socket.handshake.headers.cookie;
        console.log("SOCKET COOKIES:", socket.handshake.headers.cookie);
         
        if(!cookieHeader){
          const error = new Error("Authentication required");
          error.statusCode = 401;
          throw error;
        }


        //find token inside cookie

        const tokenCookie =
               cookieHeader
               .split(";")
               .find((cookie) => cookie.startsWith("token="))         
               
               
        if(!tokenCookie){
          const error = new Error("token not found in cookie");  
            error.statusCode = 401;
            throw error;
        }
   
         
        //get token value

        const token = tokenCookie.split("=")[1];

        //verify jwt

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId);

        if(!user){
          const error = new Error("user not found");
          error.statusCode = 401;
          throw error;
        }


        socket.user = user;

        next();
       


    }catch(error){
          console.log(
            "Socket authentication error:",
            error.message
        );

        next(
            new Error("Authentication failed")
        );
    }
}


module.exports = socketAuth;