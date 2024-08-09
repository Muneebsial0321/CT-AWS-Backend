const express = require('express')
const router = express.Router()
const {createUser,deleteUser,getAllUsers,getUser,updateUser,searchUser} = require('../Controller/User')
const upload = require('../Functions/Upload')


//http://localhost:5000/users/
router.post('/',createUser)
router.post('/search',searchUser)
router.get('/',getAllUsers)
router.get('/:id',getUser)
router.post('/:id',updateUser)
router.delete('/:id',deleteUser) 

module.exports = router