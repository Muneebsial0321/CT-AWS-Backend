const express = require('express')
const router = express.Router()
const {paymentByStripe} = require('../Controller/Payments/Stripe')
const bodyParser = require("body-parser")
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Ticket = require('../Schemas/Ticket')
const { v4: uuidv4 } = require('uuid');
const endpointSecret = process.env.STRIPE_WEBHOOK



//http://localhost:5000/payments/stripe
router.post('/stripe',paymentByStripe)
 

router.post('/webhook', express.raw({type: 'application/json'}),async (request, response) => {
  const sig = request.headers['stripe-signature'];
  console.log("hook working")

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`)
    console.log(err)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }  
    

  try{
  if(event.type=='payment_intent.succeeded'){
    console.log("payment success full")
    const {metadata}=event.data.object
    const ticket={...metadata}
    const _id = uuidv4();
    const t = new Ticket({_id,...ticket})
    const d= await t.save()
    console.log("ticket saved")
  }
  response.send();}
  catch(e){
    console.log("error is",e)
    response.send(e)
  }
  
  
});

module.exports = router 
