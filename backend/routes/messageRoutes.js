
const express = require("express");

const router = express.Router();

const {sendMessage,getMessages,markMessageAsRead} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");



router.get("/:userId", authMiddleware, 

    async (req, res, next) => {

        try{
           const messages = await getMessages(
            req.user._id,   
            req.params.userId
        );

        res.status(200).json({
            success: true,
            message: "messages fetched successfully",
            messages: messages
        });
    

        }
        catch(error){
            next(error);
        }
    }

);



//mark as read


router.post("/read", authMiddleware, async(req,res,next)=>{



    try{

        await markMessageAsRead(
            req.user._id,
            req.body.senderId
        );

        res.status(200).json({
            success: true,
            message: "messages marked as read successfully"
        });

    }catch(error){
        next(error);
    }

});


module.exports = router;