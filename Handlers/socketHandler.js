// socketHandler.js
const e = require('express');
const ChatRoom = require('../Schemas/ChatRoom');
const clientID = process.env.ZOOM_ID
const axios = require('axios');
const redirectUri = 'http://localhost:5000/zoom/callback';


const socketHandler = (io) => {
  try {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('joinRoom', async ({ roomId, userId }) => {
        socket.join(roomId);
        const chatRoom = await ChatRoom.get(roomId);
        // // if (chatRoom) {
        socket.emit('previousMessages', chatRoom.messages);
      });



      socket.on('sendMessage', async ({ roomId, sender, message }) => {
        const timestamp = new Date();
        let chatRoom = await ChatRoom.get(roomId);
        if (chatRoom.users.includes(sender)) {
          await ChatRoom.update(
            { _id: roomId },
            { $ADD: { messages: [{ sender, message, timestamp }] } }
          );
          io.to(roomId).emit('receiveMessage', { sender, message, timestamp });
          console.log('message was added')
        }

      });



      socket.on('zoomAuth', async ({roomId}) => {
        console.log("zoomauth socket")
        const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}`;
        socket.emit('receiveAuthUrl', zoomAuthUrl);
        // socket.to(roomId).emit('receiveAuthUrl', zoomAuthUrl);
        // io.to(roomId).emit('receiveMessage', { sender, message, timestamp });
      });



      socket.on('sendMeetingUrl', async (accessToken) => {
        const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
          topic: "none",
          type: 2, // Scheduled meeting
          start_time: Date.now(),
          duration: 45,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        let data = { sender: response.data.start_url, joiner: response.data.join_url }
        socket.emit('receive_url', data)
        // socket.to(roomId).emit('receiveAuthUrl', zoomAuthUrl);
        // io.to(roomId).emit('receiveMessage', { sender, message, timestamp });

      });



      socket.on('deleteMessage',async({roomId,sender, messageId})=>{
        let chatRoom = await ChatRoom.get(roomId);
        if (chatRoom) {
          const updatedMessages = chatRoom.messages.filter(
            (msg) => msg.messageId !== messageId
          );
          await ChatRoom.update(
            { _id: roomId },
            { $SET: { messages: updatedMessages } }
          );
        const  chatRoom_ = await ChatRoom.get(roomId);
          console.log('Message deleted successfully');
          socket.emit('previousMessages', chatRoom_.messages);
        } else {
          console.log('Chat room does not exist');
        }
      })

      

      socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
      });
    });
  }
  catch (error) {
    console.log(error)
  }
}


module.exports = socketHandler;

