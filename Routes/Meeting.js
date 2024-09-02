const express = require('express');
const router = express.Router();
const {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeetingById,
    deleteMeetingById,
} = require('../Controller/Meeting'); // Replace with your actual controller path


//http://localhost:5000/jobs/

router.post('/', createMeeting);
router.get('/', getAllMeetings);
router.get('/:id', getMeetingById);
router.put('/:id', updateMeetingById);
router.delete('/:id', deleteMeetingById);


module.exports = router 