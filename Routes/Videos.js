const express = require('express')
const router = express.Router()
const upload = require('../Functions/Upload')
const { uploadVideo,viewVideo,viewStream} = require('../Controller/Video')



//http://localhost:5000/users/
router.post('/:id',upload.single('video'),uploadVideo)
router.get('/:id',viewStream)
// router.get('/:id',viewVideo)
router.delete('/:id')

module.exports = router