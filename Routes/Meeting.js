const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    deleteMeetingById,
} = require('../Controller/Meeting'); // Replace with your actual controller path


//http://localhost:5000/meetings/

router.post('/', createMeeting);
router.get('/', getAllMeetings);
router.get('/:id', getMeetingById);
router.delete('/:id', deleteMeetingById);


module.exports = router 