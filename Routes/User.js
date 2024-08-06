const express = require('express')
const router = express.Router()
const {createUser,deleteUser,getAllUsers,getUser,updateUser} = require('../Controller/User')



//http://localhost:5000/users/
router.post('/',createUser)
router.get('/',getAllUsers)
router.get('/:id',getUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)

module.exports = router