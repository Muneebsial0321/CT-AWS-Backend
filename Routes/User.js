const express = require('express')
const router = express.Router()
const {createUser,deleteUser,getAllUsers,getUser,updateUser,searchUser,updateUserPicture} = require('../Controller/User')
const upload = require('../Functions/Upload')
const admin = require('../Middlewares/isAdmin');



//http://localhost:5000/users/
router.post('/',createUser)
router.post('/search',searchUser)
router.get('/',getAllUsers)
router.get('/:id',getUser)
router.put('/profilepic/:id',upload.single("profilePic"),updateUserPicture)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser) 

module.exports = router