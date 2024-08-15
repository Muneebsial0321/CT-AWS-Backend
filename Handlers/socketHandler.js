// socketHandler.js
const ChatRoom = require('../Schemas/ChatRoom'); // Adjust the path as necessary

// 728bd845-a3de-4d17-babd-4e7d87cbce69

const socketHandler = (io) => {
  io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);


      socket.on('joinRoom', async ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      const chatRoom = await ChatRoom.get(roomId);
      // if (chatRoom) {
        console.log("chatRoom")
        console.log(chatRoom)

        socket.emit('previousMessages', chatRoom.messages);
      // }
    });
  

    socket.on('sendMessage', async ({ roomId, sender, message }) => {
      const timestamp = new Date();

     
      // Fetch or create the chat room
      let chatRoom = await ChatRoom.get(roomId);
      if (chatRoom.users.includes(sender)) {

      await ChatRoom.update(
        { _id: roomId }, 
        { $ADD: { messages: [{ sender, message, timestamp }] } } 
      );
      io.to(roomId).emit('receiveMessage', { sender, message, timestamp });
      console.log('message was added' ,chatRoom)
           }
          
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;

