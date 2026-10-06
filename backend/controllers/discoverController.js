
 const Swipe = require("../models/swipe.model");
 const User = require("../models/user.model");


 
const discoverUsers = async(req,res,next)=>{

    try{
     
        const currentUserId = req.user._id;  // loginuser


        const swipes = await Swipe.find(
            {
                fromUser: currentUserId
            }).select("toUser");           // not call toUser 




            const swipeUserIds = swipes.map(  // map which i already swipe 
                (swipe)=> swipe.toUser
            );


            swipeUserIds.push(currentUserId);   // add yourself also



            //discover user

            const users = await User.find({
                _id:{
                    $nin: swipeUserIds
                },


                gender: req.user.interestedIn
            }).select("-password")
               .limit(20);

               

               res.status(200).json({
                success: true,
                message: "discover fetched ",
                users,
                count:users.length,

               });

    }catch(error){
        next(error);
    }
}


module.exports = discoverUsers;