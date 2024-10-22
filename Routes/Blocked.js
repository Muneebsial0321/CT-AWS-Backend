const express = require('express');
const router = express.Router();
const {createBlockedUser,getBlockedUsers,unblockUser} = require('../Controller/Blocked');

// Route to block a user
router.post('/',createBlockedUser);

// Route to get all blocked users for a specific user
router.get('/',getBlockedUsers);

// Route to unblock a user (delete blocked user entry)
router.delete('/:id',unblockUser );

module.exports = router;
