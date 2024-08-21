const express = require('express')
const router = express.Router()
const {paymentByStripe} = require('../Controller/Payments/Stripe')
const bodyParser = require("body-parser")
const stripe = require("stripe")(process.env.STRIPE_SECRET);



//http://localhost:5000/payments/stripe
router.post('/stripe/:id',paymentByStripe)


// Webhook to handle payment confirmation (optional)
// router.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
//   const event = req.body;

//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log('PaymentIntent was successful!', paymentIntent);
//       // Handle post-payment logic, such as updating order status
//       break;
//     // Handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   res.json({ received: true });
// });
const endpointSecret = process.env.STRIPE_WEBHOOK

router.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});



module.exports = router 