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
// const getAllChatRooms= async(req,res)=>{
//   const cr = await ChatRoom.scan().exec()
//   console.log(cr)
//   res.json(cr)


// }
const getMyChatRooms= async(req,res)=>{}
const deleteChatRoom= async(req,res)=>{}
// module.exports = {getAllChatRooms}

