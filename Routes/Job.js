const express = require('express')
const router = express.Router()
const {createJob,getAllJobs,updateJob,deleteJob,getJob,searchJob} = require('../Controller/Job')
const upload = require('../Functions/Upload')



//http://localhost:5000/jobs/
router.post('/',upload.single('logo'),createJob)
router.post('/search',searchJob)
router.get('/:id',getJob)
router.get('/',getAllJobs)
router.put('/:id',updateJob)
router.delete('/:id',deleteJob)

module.exports = router