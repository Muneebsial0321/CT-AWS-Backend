const express = require('express')
const router = express.Router()
const {getAllUsers} = require('../Controller/User')
const {getInvesters, get_Users,getEntreperneurs}= require('../Controller/Dashboard')
const {getAllNotifications} = require('../Controller/Notifications')
// const {getAllChatRooms} = require('../Controller/ChatRoom')



//http://localhost:5000/admin/allusers
router.get('/allusers',getAllUsers)
//http://localhost:5000/admin/investers
router.get('/investers',getInvesters)
//http://localhost:5000/admin/users
router.get('/users',get_Users)
//http://localhost:5000/admin/entrepreneur
router.get('/entrepreneur',getEntreperneurs)
//http://localhost:5000/admin/notifications
router.get('/not',getAllNotifications)
// router.get('/cr',getAllChatRooms)

module.exports = router