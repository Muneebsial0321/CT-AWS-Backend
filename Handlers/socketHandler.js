// socketHandler.js
const ChatRoom = require('../Schemas/ChatRoom'); // Adjust the path as necessary

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('joinRoom', async ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      // Optionally, send previous messages to the user
      const chatRoom = await ChatRoom.get(roomId);
      if (chatRoom) {
        socket.emit('previousMessages', chatRoom.messages);
      }
    });

    socket.on('sendMessage', async ({ roomId, sender, message }) => {
      const timestamp = new Date();

      let chatRoom = {
        messages:[]
      }
      // Fetch or create the chat room
      // let chatRoom = await ChatRoom.get(roomId);
      // if (!chatRoom) {
      //   chatRoom = new ChatRoom({
      //     _id: roomId,
      //     users: [sender],
      //     messages: [],
      //   });
      // }

      // Add the message to the chat room
      chatRoom.messages.push({ sender, message, timestamp });
      // await chatRoom.save();

      // Broadcast the message to everyone in the room
      io.to(roomId).emit('receiveMessage', { sender, message, timestamp });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
