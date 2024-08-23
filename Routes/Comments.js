const express = require('express')
const router = express.Router()
const {createComment,getComments,deleteComments} = require('../Controller/Comments')



//http://localhost:5000/jobs/
router.post('/:id',createComment)
// router.get('/',(req,res)=>res.send("working"))
router.get('/:id',getComments)
router.delete('/:id',deleteComments)

module.exports = router 