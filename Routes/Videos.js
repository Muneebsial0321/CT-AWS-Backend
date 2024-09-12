const express = require('express')
const router = express.Router()
const upload = require('../Functions/Upload')
const { uploadVideo,viewVideo,viewStream,getUserVideos,getAllVideos,getVideo} = require('../Controller/Video')
const isNotUser = require('../Middlewares/videoCheck')



//http://localhost:5000/upload/

// for uploading a video takes userId as a param
router.post('/:id',upload.single('video'),uploadVideo)

// for fetching a single video along side uploader info and reviews takes video Id as a param
router.get('/:id',getVideo)

// for fetching all videosof user takes user Id as a param
router.get('/user/:id',getUserVideos)

// just gets all videos
router.get('/videos/all',getAllVideos)

router.delete('/:id')

module.exports = router