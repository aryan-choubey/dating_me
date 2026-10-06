


const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const signup = async(req,res,next)=>{
try{

    const {name , email, password} = req.body;

    if(!name|| !email || !password){
        const error = new Error("all feild are requires");
    

    error.statusCode = 400;

    throw error;

    };



    const existingUser =  await User.findOne({email});

    if(existingUser){
      const error = new Error("Email already exisits");
        error.statusCode = 409;
        throw error;
      
    };




    const hashpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashpassword,
    });



     //create JWT

    const token = jwt.sign(
        {
            userId: user._id,
        },
         process.env.JWT_SECRET,
        {
           expiresIn: "7d",
        }
    );


   //store jwt in cookies
      
      res.cookie("token", token,{

        httpOnly : true,
        secure : false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,

      });
      


      res.status(201).json({
        sucess:true,
        message: " Account created sucessfully"
      });

}catch(error){

  next(error);
  
 }
};



//Userdetail controller


const userDetail = async (req, res, next) => {
    try {

        // Photos uploaded by Multer
        const photos = req.files.map(
            (file) => `/uploads/${file.filename}`
        );


        // User ID from JWT
        const userId = req.user._id;


        // Data from frontend
        const {
            name,
            dob,
            gender,
            interestedIn,
            bio,
            interests,
            city,
            state,
            country
        } = req.body;


        // Find user
        const user = await User.findById(userId);

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }


        // Update details
        user.name = name;
        user.dob = dob;
        user.gender = gender;
        user.interestedIn = interestedIn;
        user.bio = bio;

        user.photos = photos;

        user.interests = interests;

        // Updated location
        user.location = {
            city: city,
            state: state,
            country: country
        };


        // Profile completed
        user.profileCompleted = true;


        // Save user
        await user.save();


        res.status(200).json({
            success: true,
            message: "User details updated successfully"
        });


    } catch (error) {
        next(error);
    }
};



//Login controller


  const login =async(req,res,next)=>{

    try{

      const {email,password} = req.body;
      
      if(!email || !password){
        const error = new Error("Email and Password requires");

        error.statusCode = 400;
        throw error;
      };


      //find user 


      const user = await User.findOne({email});

      if(!user){
        const error = new Error("user not register");

        error.statusCode = 404;
        throw error;
      };


      //checking password

      const matchpassword = await bcrypt.compare(
        password,
        user.password 
      );


      if(!matchpassword){
        const error = new Error("password incorrect");
        error.statusCode = 401;
        throw error;
      }
      


      // create jwt

      const token = jwt.sign(
        {
           userId: user._id  
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        },
      );



        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


       res.status(200).json(
        {
            sucess:true,
            message:"Login Sucessfully"
        }
       );



    }catch(error){
        next(error);
    }

  };








module.exports = {
    signup,login,userDetail
};