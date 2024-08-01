const express = require('express')
const router = express.Router()
const {createUser,getUsers} = require('../Controller/User')



//http://localhost:5000/users/
router.post('/',createUser)
router.get('/',getUsers)
router.get('/:id')
router.get('/:id')
router.put('/:id')
router.delete('/:id')

module.exports = router