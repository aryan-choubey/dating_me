

const socketAuth = require("./socketAuth");
const {
  sendMessage
} = require("../controllers/messageController");


const setupSocket = (io) => {

    io.use(socketAuth);


    io.on("connection", (socket) =>{
        
        console.log(
            "user connected",
            socket.user._id.toString()
        );



        //join personal room

        const userId = socket.user._id.toString();

        socket.join(userId);

        console.log(
            "user joined room",
            userId
        );



        //send message

        socket.on("sendMessage",async(data)=>{
            
            try{
             
                const {
                    receiverId,    // this come from frontend socket 
                    message
                } = data;

                const senderId = socket.user._id.toString();


                //send message

                const newMessage = 
                           await sendMessage
                           (senderId,
                            receiverId,
                            message
                           );


                 //send message to receiver
                 
                 io.to(
                    receiverId.toString()
                 ).emit(
                    "receiveMessage",
                    newMessage
                 );



                 //send back to sender

                 io.to(
                    senderId.toString()
                 ).emit(
                    "messageSent",
                    newMessage
                 );




            }catch(error){

                console.log(
                    "Socket send message error:",
                    error.message
                );

                socket.emit(
                    "messageError",
                    {
                        message:error.message,
                    }
                );
            }
        });



        //Disconnect socket

        socket.on("disconnect",()=>{

            console.log(
                "User disconnected",
                socket.user._id.toString()
            );

        });




    })
}

module.exports = setupSocket;