const express = require('express');
const router = express.Router();
const {createBlockedUser,getBlockedUsers,unblockUser} = require('../Controller/Blocked');

// Route to block a user
router.post('/block',createBlockedUser);

// Route to get all blocked users for a specific user
router.get('/blocked/:userID',getBlockedUsers);

// Route to unblock a user (delete blocked user entry)
router.delete('/unblock/:id',unblockUser );

module.exports = router;
