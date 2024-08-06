const express = require('express')
const router = express.Router()
const {createPodcast,getAllPodcasts,getPodcast,deletePodcast,updatePodcast} = require('../Controller/Podcasts')



//http://localhost:5000/jobs/
router.post('/',createPodcast)
router.get('/:id',getPodcast)
router.get('/',getAllPodcasts)
router.put('/:id',updatePodcast)
router.delete('/:id',deletePodcast)

module.exports = router