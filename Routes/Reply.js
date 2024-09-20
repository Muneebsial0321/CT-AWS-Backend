const express = require('express');
const router = express.Router();
const { createReply, deleteReply, getAllReply, getReviewReply } = require('../Controller/Reply');

// Route to create a reply
router.post('/', createReply);

// Route to get all replies
router.get('/', getAllReply);

// Route to get replies for a specific review by reviewId
router.get('/:id', getReviewReply);

// Route to delete a reply by replyId
router.delete('/:id', deleteReply);

module.exports = router;
