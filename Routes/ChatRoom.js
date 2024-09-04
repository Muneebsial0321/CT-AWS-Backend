const express = require('express');
const router = express.Router();
const {deleteChatRoom,getAllChatRooms,getMyChatRooms,createChatRoom,getARoom} = require('../Controller/ChatRoom'); // Replace with your actual controller path


//http://localhost:5000/jobs/

router.post('/', createChatRoom);
router.get('/', getAllChatRooms);
router.get('/:id', getMyChatRooms);
router.get('/room/:id', getARoom);
router.delete('/:id', deleteChatRoom);


module.exports = router 