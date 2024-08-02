const express = require('express')
const router = express.Router()
const {getUsers} = require('../Controller/User')
const {getInvesters, get_Users,getEntreperneurs}= require('../Controller/Dashboard')




//http://localhost:5000/admin/investers
router.get('/allusers',getUsers)
router.get('/investers',getInvesters)
router.get('/users',get_Users)
router.get('/entrepreneur',getEntreperneurs)

module.exports = router