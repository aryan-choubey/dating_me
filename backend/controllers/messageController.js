
const Match = require("../models/match.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");





    const checkMatch = async(user1,user2)=>{

        const match = await Match.findOne({
            $or:[
                {user1:user1,
                user2:user2},

                {user1:user2,
                user2:user1}
            ] 
        });

        return match;


    };




    //send Message--

    const sendMessage = async(senderId,receiverId,message)=>{

        const receiver = await User.findById(receiverId);

        if(!receiver){
            const error = new Error("receiver not found");
            error.statusCode = 404;
            throw error;
        };



        //check whether user are matched or not----

        const match = await checkMatch(senderId,receiverId);

        if(!match){
            const error = new Error("you are not matched with this user");
            error.statusCode = 400;
            throw error;
        };


        if(!message || message.trim()){
            const error = new Error("message cannot be empty");
            error.statusCode = 400;
            throw error;
        };


        //save message 

        const newMessage = new Message.create({
            sender:senderId,
            receiver:receiverId,
            match:match._id,
            message:message.trim(),
        });

        

        //get sender and receiver details---->

        const populatedMessage = await Message.findById(newMessage._id)
                                 .populate("sender","name photos")
                                 .populate("receiver","name photos");
                        


            return populatedMessage;
    };




    //GET OLD MESSAGE---------

    const getMessages = async(
        userId,
        otherUserId,
    ) =>{


        //checkmatch

        const match = await checkMatch(userId,otherUserId);

        if(!match){
            const error = new Error("you are not matched with this user");
            error.statusCode = 400;
            throw error;
        }



        const messages = await Message.find({
            $or:[
                {sender:userId,
                    receiver:otherUserId},

                {sender:otherUserId,
                    receiver:userId}

            ]
        })  

           .sort({createdAt:1})
           .populate("sender","name photos")
           .populate("receiver","name photos")



          return messages;


    }







    //mark message as read


    const markMessageAsRead = async(
        userId,
        senderId,
    ) =>{

        await Message.updateMany({
            sender:senderId,
            receiver:userId,
            isRead:false,
        },{
            $set:{isRead:true}
        });
    



};



module.exports = {
    sendMessage,
    getMessages,
    markMessageAsRead,
};


     

