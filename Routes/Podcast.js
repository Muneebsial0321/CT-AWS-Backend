const express = require('express')
const router = express.Router()
const {createPodcast,getAllPodcasts,getPodcast,deletePodcast,updatePodcast} = require('../Controller/Podcasts')
const upload = require('../Functions/Upload')


//http://localhost:5000/jobs/
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]),createPodcast)
router.get('/:id',getPodcast)
router.get('/',getAllPodcasts)
router.put('/:id',updatePodcast)
router.delete('/:id',deletePodcast)

module.exports = router