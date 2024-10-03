const express = require('express')
const router = express.Router()
const upload = require('../Functions/Upload')
const { uploadVideo,getMyFeed,getUserVideos,getAllVideos,getVideo,deleteVideo,__init__} = require('../Controller/Video')
const isNotUser = require('../Middlewares/videoCheck')



//http://localhost:5000/upload/

// for uploading a video takes userId as a param
router.post('/:id',upload.single('video'),uploadVideo)

// for fetching a single video along side uploader info and reviews takes video Id as a param
router.get('/:id',getVideo)
router.get('/',__init__)

// for fetching all videosof user takes user Id as a param
router.get('/user/:id',getUserVideos)
// fetching feed
router.get('/user/feed/:id',getMyFeed)
// just gets all videos
router.get('/videos/all',getAllVideos)

router.post('/delete/:id',deleteVideo)

module.exports = router