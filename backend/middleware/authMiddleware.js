


const jwt = require("jsonwebtoken");

const authMiddleware = async(req, res, next) =>{
  try{
   
    const token = req.cookies.token;

    if(!token){

        const error = new Error("Not authenticated");

        error.statusCode = 401;
        throw error;
    }

      
      const decoded = jwt.verify(
       token,
       process.env.JWT_SECRET
      );



      //SAVE  DECODED USER INFORMATION

      req.user = decoded;

      next();

   
  }catch(error){
      next(error);
  }
};


 module.exports = authMiddleware;