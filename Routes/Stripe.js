const express = require('express')
const router = express.Router()
const {paymentByStripe,userAgent} = require('../Controller/Payments/Stripe')
const bodyParser = require("body-parser")
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Ticket = require('../Schemas/Ticket')
const { v4: uuidv4 } = require('uuid');



//http://localhost:5000/payments/stripe
router.get('/plt',userAgent)
router.post('/stripe',paymentByStripe)
 
const endpointSecret = process.env.STRIPE_WEBHOOK

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
    
  // Handle the event
  // switch (event.type) {
  //   case 'payment.created':
  //     console.log("pay created")
  //     const {receipt_url}=event.data.object
  //     ticket={...ticket,receipt_url}
  //     break;

  //   case 'payment_intent.succeeded':


  //     console.log("payintent")
  //     const {metadata}=event.data.object
  //     ticket={...ticket,metadata}
  //     break;


  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }
  try{
  // if(event.type=='payment.created'){
  //   console.log("if1")
  //   const {receipt_url}=event.data.object
  //   ticket={...ticket,ticketReceiptUrl:receipt_url}
  // }
  if(event.type=='payment_intent.succeeded'){
    console.log("if2")
    const {metadata}=event.data.object
    const ticket={...metadata}
    const _id = uuidv4();
    const t = new Ticket({_id,...ticket})
    const d= await t.save()
    console.log({d})
  }
  response.send();}
  catch(e){
    console.log("error is",e)
    response.send(e)
  }
  
  
});



module.exports = router 

// event success full
// {
//   id: 'evt_3PqRfKRs7crShRfB1NYmnVGa',     
//   object: 'event',
//   api_version: '2024-06-20',
//   created: 1724297191,
//   data: {
//     object: {
//       id: 'ch_3PqRfKRs7crShRfB1A6kDJyn',  
//       object: 'charge',
//       amount: 29900,
//       amount_captured: 29900,
//       amount_refunded: 0,
//       application: null,
//       application_fee: null,
//       application_fee_amount: null,       
//       balance_transaction: 'txn_3PqRfKRs7crShRfB11cCSEcS',
//       billing_details: [Object],
//       calculated_statement_descriptor: 'Stripe',
//       captured: true,
//       created: 1724297186,
//       currency: 'usd',
//       customer: null,
//       description: null,
//       destination: 'acct_1Pq51ARswB9V3ruE',
//       dispute: null,
//       disputed: false,
//       failure_balance_transaction: null,  
//       failure_code: null,
//       failure_message: null,
//       fraud_details: {},
//       invoice: null,
//       livemode: false,
//       metadata: [Object],
//       on_behalf_of: null,
//       order: null,
//       outcome: [Object],
//       paid: true,
//       payment_intent: 'pi_3PqRfKRs7crShRfB1qP7xom4',
//       payment_method: 'pm_1PqRfHRs7crShRfB3rdhIfXB',
//       payment_method_details: [Object],   
//       receipt_email: null,
//       receipt_number: null,
//       receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUGhYaHlSczdjclNoUmZCKOffmrYGMgbrCwq34iY6LBaT4YWeRyhYyRSiifgtDjU6ljO9TCNzhxgHX5W0L6IEcBAotFmCdkLQDsFe',
//       refunded: false,
//       review: null,
//       shipping: null,
//       source: null,
//       source_transfer: null,
//       statement_descriptor: null,
//       statement_descriptor_suffix: null,  
//       status: 'succeeded',
//       transfer: 'tr_3PqRfKRs7crShRfB1HSqDsCd',
//       transfer_data: [Object],
//       transfer_group: 'group_pi_3PqRfKRs7crShRfB1qP7xom4'
//     },
//     previous_attributes: {
//       balance_transaction: null,
//       receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xUGhYaHlSczdjclNoUmZCKOffmrYGMgaHHSG77KA6LBaVU2X5O9XOJ2yQY-96UGvCqNGXHmXRQC9ef8Sg0GGkyraCMDmmg9KvAaTA',
//       transfer: null
//     }
//   },
//   livemode: false,
//   pending_webhooks: 2,
//   request: { id: null, idempotency_key: null },
//   type: 'charge.updated'
// }
