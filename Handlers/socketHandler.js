// socketHandler.js
const e = require('express');
const ChatRoom = require('../Schemas/ChatRoom');
const clientID = process.env.ZOOM_ID
const axios = require('axios'); 
const { decrypt } = require('dotenv');
const redirectUri = 'http://localhost:5000/zoom/callback'; 

// 728bd845-a3de-4d17-babd-4e7d87cbce69

const socketHandler = (io) => {
  try {
    

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    socket.on('joinRoom', async ({roomId,userId}) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);
      const chatRoom = await ChatRoom.get(roomId);
      // // if (chatRoom) {
      console.log("chatRoom")
      console.log({messages:chatRoom.messages})

      socket.emit('previousMessages', chatRoom.messages);
      // socket.emit('previousMessages', 'messages'); 
      // }
    });

    socket.on('sendMessage', async ({ roomId, sender, message }) => {
      const timestamp = new Date();
      console.log("getting message")

      // Fetch or create the chat room
      let chatRoom = await ChatRoom.get(roomId);
      // console.log({chatRoom})
      if (chatRoom.users.includes(sender)) {

        await ChatRoom.update(
          { _id: roomId },
          { $ADD: { messages: [{ sender, message, timestamp }] } }
        );
        io.to(roomId).emit('receiveMessage', { sender, message, timestamp });
        console.log('message was added')
      }

    });

    socket.on('zoomAuth', async () => {
      console.log("zoomauth socket")
      // if (socket.rooms.has(roomId)) {
      //   const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}`;
      //   // Emit the Zoom authorization URL to all clients in the room, excluding the sender
      //   socket.to(roomId).emit('receiveAuthUrl', zoomAuthUrl);
      // } else {
      //   console.log(`Socket ${socket.id} is not in room ${roomId}, cannot send Zoom auth URL.`);
      // }
 
      const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}`;
      console.log({zoomAuthUrl})
      // socket.to(roomId).emit('receiveAuthUrl', zoomAuthUrl);
      socket.emit('receiveAuthUrl', zoomAuthUrl);
 
      // }
    });

    socket.on('sendMeetingUrl', async (accessToken) => {
      console.log("token is")
      console.log(accessToken)
      //   socket.join(roomId);
      //   console.log(`User ${userId} joined room ${roomId}`);
      //   const chatRoom = await ChatRoom.get(roomId);
      // if (chatRoom) {

      // const { topic, startTime, duration } = req.body; // These details can be passed from the frontend

      console.log("metting")
      const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
        topic: "none bxxb",
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

    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
}
 catch (error) {
  console.log(error)
}}


module.exports = socketHandler;  

