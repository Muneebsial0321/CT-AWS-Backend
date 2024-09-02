const express = require('express');
const router = express.Router();
const {deleteChatRoom,getAllChatRooms,getMyChatRooms,createChatRoom} = require('../Controller/ChatRoom'); // Replace with your actual controller path


//http://localhost:5000/jobs/

router.post('/', createChatRoom);
router.get('/', getAllChatRooms);
router.get('/:id', getMyChatRooms);
router.delete('/:id', deleteChatRoom);


module.exports = router 