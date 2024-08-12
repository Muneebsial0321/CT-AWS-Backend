const express = require('express')
const router = express.Router()
const {createEvent,getAllEvents,getEvent,deleteEvent,updateEvent,searchEvents} = require('../Controller/Events')
const upload = require('../Functions/Upload')


//http://localhost:5000/jobs/
// router.post('/',upload.single('file'),createEvent)
router.post('/',upload.fields([
    { name: 'coverImage', maxCount: 1 },     // One cover image
    { name: 'mediaFiles', maxCount: 10 }     // Up to 10 media files
  ]),createEvent)
// router.post('/',createEvent)
router.post('/search',searchEvents)
router.get('/:id',getEvent)
router.get('/',getAllEvents)
router.put('/:id',updateEvent)
router.delete('/:id',deleteEvent)

module.exports = router