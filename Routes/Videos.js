const express = require('express')
const router = express.Router()
const upload = require('../Functions/Upload')
const { uploadVideo} = require('../Controller/Video')



//http://localhost:5000/users/
router.post('/:id',upload.single('video'),uploadVideo)
router.get('/')
router.delete('/:id')

module.exports = router