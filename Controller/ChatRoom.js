const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');
const ChatRoom =require('../Schemas/ChatRoom')

// Create a new chat room with the given users and dummy messages
const createChatRoom = async (req,res) => {
  const self__ = req.params.id
  const user__ = req.body.user
  const chatRoom = new ChatRoom({
    _id: uuidv4(),  // Unique identifier for the chat room
    users: [
      self__,
      user__
    ],
    messages: []
  });

  try {
    await chatRoom.save();
    console.log('Chat room  messages');
    res.json(chatRoom)
  } catch (error) {
    console.error('Error creating chat room:', error);
  }
};
const getAllChatRooms= async(req,res)=>{
  const cr = await ChatRoom.scan().attributes(['_id','users']).exec()

  res.json({count:cr.length,data:cr})

// Cat.scan().attributes(["id", "name"]); // Return all items but only return the `id` & `name` properties for each item
}
const getMyChatRooms= async(req,res)=>{
  try {
    const { id } = req.params;
    // const chatRooms = await ChatRoom.scan().attributes(['users','_id']).exec();
    const chatRooms = await ChatRoom.scan().exec();
    const myRooms = chatRooms.map((e)=>{
    //  checking if user is in the array os users
     if(e.users.includes(id)){
       return e
     }

    }
  )
    res.status(200).json({count:myRooms.length,data:myRooms});
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}
const deleteChatRoom= async(req,res)=>{}
module.exports = {getMyChatRooms,deleteChatRoom,getAllChatRooms,createChatRoom}

