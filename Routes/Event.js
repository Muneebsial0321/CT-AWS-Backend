const express = require('express')
const router = express.Router()
const {createEvent,getAllEvents,getEvent,deleteEvent,updateEvent} = require('../Controller/Events')



//http://localhost:5000/jobs/
router.post('/',createEvent)
router.get('/:id',getEvent)
router.get('/',getAllEvents)
router.put('/:id',updateEvent)
router.delete('/:id',deleteEvent)

module.exports = router