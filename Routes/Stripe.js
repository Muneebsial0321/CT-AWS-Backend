const express = require('express')
const router = express.Router()
const {paymentByStripe} = require('../Controller/Payments/Stripe')



//http://localhost:5000/payments/stripe
router.post('/stripe/:id',paymentByStripe)


module.exports = router 