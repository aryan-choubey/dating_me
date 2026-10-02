const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    { 

         name:{
            type: String,
            trim: true,

        },

        email:{
            type: String,
             unique: true,
             sparse: true,
             lowercase: true,
             trim: true,
             required:true,
        },

     

        password:{
            type: String,
            required:true,
        },

        
        
       


    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    interestedIn: {
      type: String,
      enum: ["male", "female", "everyone"],
    },

    bio: {
      type: String,
      maxlength: 500,
    },

    photos: [
      {
        type: String,
      },
    ],

    interests: [
      {
        type: String,
      },
    ],

    location: {
      city: String,
      state: String,
      country: String,
    },

     profileCompleted: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,




});

const User = mongoose.model("User",userSchema);
module.exports = User;