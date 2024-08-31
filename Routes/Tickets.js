const express = require('express')
const router = express.Router()
const {getAllTickets,getMyTickets} = require('../Controller/Tickets')


//http://localhost:5000/tickets/all
//http://localhost:5000/tickets/all
router.get('/all',getAllTickets)
router.get('/allusers/:id',getMyTickets)



module.exports = router