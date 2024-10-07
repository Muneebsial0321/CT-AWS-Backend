const express = require('express')
const router = express.Router()
const {getAllTickets,getMyTickets} = require('../Controller/Tickets')


//http://localhost:5000/tickets/all
//http://localhost:5000/tickets/all
router.get('/',getAllTickets)
router.get('/user/:id',getMyTickets)
router.post('/user/:id',getMyTickets)



module.exports = router