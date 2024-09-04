const dynamoose = require('dynamoose');
const { v4: uuidv4 } = require('uuid');
const ChatRoom = require('../Schemas/ChatRoom')
const User = require('../Schemas/User')
// Create a new chat room with the given users and dummy messages
const createChatRoom = async (req, res) => {
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
    const myRooms =await Promise.all(chatRooms.map(async(e) => {
      if (e.users.includes(id)) {
        let data = e.users.filter((e)=>e!=id)
        let {name,picUrl,Users_PK,email} = await User.get(data[0])
        return await {...e,sender:{name,picUrl,Users_PK,email}}
      }
    }
    ))
    // console.log({myRooms})
    res.status(200).json({ count: myRooms.length, data: myRooms });
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
const deleteChatRoom = async (req, res) => { }
module.exports = { getMyChatRooms, deleteChatRoom, getAllChatRooms, createChatRoom, getARoom }

