const express = require('express')
const router = express.Router()
const {getAllUsers} = require('../Controller/User')
const {getInvesters, get_Users,getEntreperneurs}= require('../Controller/Dashboard')




//http://localhost:5000/admin/allusers
router.get('/allusers',getAllUsers)
//http://localhost:5000/admin/investers
router.get('/investers',getInvesters)
//http://localhost:5000/admin/users
router.get('/users',get_Users)
//http://localhost:5000/admin/entrepreneur
router.get('/entrepreneur',getEntreperneurs)

module.exports = router