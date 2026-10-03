
 const Swipe = require("../models/swipe.model");
 const Match = require("../models/match.model");
const swipeUser = async(req,res,next)=>{

    try{

        const fromUser = req.user._id;
        console.log(req.user?._id);

        const {toUser , action} = req.body;


        if(!toUser || !action){
            const error = new Error("action required to user");
            error.statusCode = 400;
            throw error;
        };



         const validActions = [
            "like",
            "pass", 
            "superlike",
             "block"

         ]


         if(!validActions.includes(action)){
            const error = new Error("ivalid swipe actions");
              
                error.statusCode = 400;
                throw error;
            
         }




         //cannot swipe your self

         if(fromUser.toString() === toUser.toString()){
             const error = new Error("you cannot swipe your self");
              
                error.statusCode = 400;
                throw error;
         };
    





    if (action === "block") {
              await Swipe.findOneAndUpdate(
        {
          fromUser,
          toUser,
        },
        {
          fromUser,
          toUser,
          action: "block",
        },
        {
          upsert: true,
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        action: "block",
        matched: false,
        message: "User blocked successfully",
      });
    }





    // 4. LIKE / SUPERLIKE / DISLIKE
    await Swipe.findOneAndUpdate(
      {
        fromUser,
        toUser,
      },
      {
        fromUser,
        toUser,
        action,
      },
      {
        upsert: true,
        returnDocument: "after"
      }
    );



    // 5. MATCH CONDITION
    let matched = false;

    if (action === "like" || action === "superlike") {

  const otherUserSwipe = await Swipe.findOne({
    fromUser: toUser,
    toUser: fromUser,
    action: {
      $in: ["like", "superlike"],
    },
  });

  if (otherUserSwipe) {

    const firstUser =
      fromUser.toString() < toUser.toString()
        ? fromUser
        : toUser;

    const secondUser =
      fromUser.toString() < toUser.toString()
        ? toUser
        : fromUser;

    await Match.findOneAndUpdate(
      {
        user1: firstUser,
        user2: secondUser,
      },
      {
        user1: firstUser,
        user2: secondUser,
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    matched = true;
  }
}

    
    return res.status(200).json({
      success: true,
      action,
      matched,
      message: matched
        ? "It's a match!"
        : `${action} successful`,
    });



    }catch(error){
    next(error);
    }
}


module.exports = swipeUser;