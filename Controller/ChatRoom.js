const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');
const ChatRoom = require('../Schemas/ChatRoom')
const User = require('../Schemas/User')

const createChatRoom = async (req, res) => {
  try {
    const self__ = req.params.id
    const user__ = req.body.user
    const chatRooms = await ChatRoom.scan().exec();
    console.log({self__,user__})
    const myRooms = chatRooms.filter((e) => (e.users.includes(user__) && e.users.includes(self__)) ? e : '')

    if (myRooms.length > 0) {
      console.log({ error: "dublicate room error", message: "chatroom already exist" })
      res.json({ error: "dublicate room error", message: "chatroom already exist" })
    }
    else {
      const chatRoom = new ChatRoom({
        _id: uuidv4(),  // Unique identifier for the chat room
        users: [
          self__,
          user__
        ],
        messages: []
      });


      await chatRoom.save();
      console.log('Chat room  messages');
      res.json({"message":"success",chatRoom})
    }
  } catch (error) {
    console.error('Error creating chat room:', error);
  }

}

const getAllChatRooms = async (req, res) => {
  const cr = await ChatRoom.scan().attributes(['_id', 'users']).exec()
 
  res.json({ count: cr.length, data: cr })

  // Cat.scan().attributes(["id", "name"]); // Return all items but only return the `id` & `name` properties for each item
}
const getMyChatRooms = async (req, res) => {
  try {
    const { id } = req.params;

    // const chatRooms = await ChatRoom.scan().attributes(['users','_id']).exec();
    const chatRooms = await ChatRoom.scan().exec();
    const myRooms = await Promise.all(chatRooms.map(async (e) => {
      if (e.users.includes(id)) {
        let data = e.users.filter((e) => e != id)
        let sender = await User.get(data[0])
        if(sender){
          return  { ...e, sender }
        }
        else{
          return  { ...e, sender:{
            picUrl:"",
            name:"",
            Users_PK:null
          } }
        }
      }
    }
    ))
    const filteredRooms=myRooms.filter((e)=>e!=null)
    res.status(200).json({ count: filteredRooms.length, data: filteredRooms });
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}
const getARoom = async (req, res) => {
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.get(id);
    res.json(chatRoom);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}
const deleteChatRoom = async (req, res) => { 
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.delete(id);
    res.json({message:"deleted",chatRoom});
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}
module.exports = { getMyChatRooms, deleteChatRoom, getAllChatRooms, createChatRoom, getARoom }

