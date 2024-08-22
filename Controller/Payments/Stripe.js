require('dotenv').config
console.log()
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
// Mock database
const tickets = new Map([
  ['ticket_1', { id: 'ticket_1', price: 2000, sellerStripeAccountId: 'acct_1Ppi8ZRtoFwfpEcp' }], // $20.00 ticket
  ['ticket_2', { id: 'ticket_2', price: 5000, sellerStripeAccountId: 'acct_1Pq51ARswB9V3ruE' }], // $50.00 ticket
  ['ticket_3', { id: 'ticket_3', price: 10000, sellerStripeAccountId: 'acct_1Ppi8ZRtoFwfpEcp' }], // $100.00 ticket
]);


// eventID = e1fddf8c-b8c2-4d54-8769-4b7a0b69f1b5
// Create a payment intent
const paymentByStripe = async (req, res) => {
    const event = await Event.get(req.params.id);
    let userWhoCreatedEventID = event.eventCreatedBy;
    let userWhoBoughtTicket = 'some name';
    const user = await User.get(userWhoCreatedEventID);
    let eventID = event._id;
    let eventPrice = event.eventTicketPrice;
    // console.log({eventID,eventPrice,userWhoCreatedEventID,user})
    // let userWhoCreatedEventStripeID;
    ticketId = 'ticket_2'; // Use ticket_2 for testing purposes
  
    // const ticket = tickets.get(ticketId);
    // if (!ticket) {
    //   return res.status(404).json({ error: 'Ticket not found' });
    // }
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Event ID: ${eventID}`, // 
                description: `\n\n\n\n\n\n\n\n
                *USER ID*: ${userWhoCreatedEventID}\n\n
                *EMAIL*: ${user.email}\n\n`
            
              },
              unit_amount: parseInt(eventPrice)*100, // Ticket price in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONT_URL}/paymentSuccess`, // Redirect after successful payment
        cancel_url: `${process.env.FRONT_URL}/paymentfailed`, // Redirect after canceled payment
        payment_intent_data: {
          transfer_data: {
            destination: 'acct_1Pq51ARswB9V3ruE', // Seller's Stripe Account ID
          },
          metadata: {
            ticketEventId:eventID, 
            ticketSellerId: userWhoCreatedEventID,
            ticketSellerId:user.email,
            ticketBuyerId: userWhoBoughtTicket
          },
     
        },
      }); 
  // console.log(session)
      res.json({
        sessionId: session.id, // Return the session ID to the client
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  







module.exports = {paymentByStripe}