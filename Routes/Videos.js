const express = require('express')
const router = express.Router()
const upload = require('../Functions/Upload')
const { uploadVideo,viewVideo,viewStream,getUserVideos,getAllVideos,getVideo} = require('../Controller/Video')
const isNotUser = require('../Middlewares/videoCheck')



//http://localhost:5000/users/
router.post('/:id',upload.single('video'),uploadVideo)
// router.get('/:id',viewStream)
router.get('/:id',getVideo)
router.get('/user/:id',getUserVideos)
router.get('/videos/all',getAllVideos)
// router.get('/:id',viewVideo)
router.delete('/:id')

module.exports = router