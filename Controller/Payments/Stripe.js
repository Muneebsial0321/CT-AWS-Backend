require('dotenv').config
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
// Mock database

// event id e12345
const products = [
  {
    name: 'premiumTicket',
    quantity: 3, // Number of items for this product
  },
  {
    name: 'generalTicket',
    quantity: 1, // Number of items for this product
  },
];

const getLineItems=(proArray,event)=>{
// prodArray will have ticket name with there quantity.....
//meanwhile event will have event object
// it shall return lineitems
  const lineItems = proArray.map((product) => ({
    price_data: {
      currency: 'usd', // Use the appropriate currency
      product_data: {
        name: product.name, // Dynamically set the product name
        description:event._id
      },
      unit_amount: event[product.name] * 100, // Stripe expects the amount in cents (for USD)
      // unit_amount: product.price * 100, // Stripe expects the amount in cents (for USD)
    },
    quantity: product.quantity, // Quantity of the product
  }));
  return lineItems

}

const paymentByStripe = async (req, res) => {

  // const event = await Event.get(req.params.id);
  const event = await Event.get('e12345');
  // const seller = await User.get(userWhoCreatedEventID);
  const seller = {email:"some email"}
  // const buyer = await User.get(req.body.id);
    // let userWhoCreatedEventID = event.eventCreatedBy;
    // let userWhoBoughtTicket = 'some name';
    // let eventID = event._id;
    // let eventPrice = event.eventTicketPrice;
    const sellerID = 'userWhoCreatedEventID';
    const buyerID = 'userWhoCreatedEventID';
    const eventID = 'event_id';
    const destination = "account no"
    // const ticket = tickets.get(ticketId);
    // if (!ticket) {
    //   return res.status(404).json({ error: 'Ticket not found' });
    // }
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:getLineItems(products,event),
        // line_items:lineItems,
        mode: 'payment',
        success_url: `${process.env.FRONT_URL}/paymentSuccess`, // Redirect after successful payment
        cancel_url: `${process.env.FRONT_URL}/paymentfailed`, // Redirect after canceled payment
        payment_intent_data: {
          transfer_data: {
            destination: 'acct_1Ppi8ZRtoFwfpEcp', // Seller's Stripe Account ID
          },
          metadata: {
            ticketEventId:eventID, 
            ticketSellerId: sellerID,
            ticketSellerEmail:seller.email,
            ticketBuyerId: buyerID
          },
     
        },
      });
      res.json({
        sessionId: session.id,
         url: session.url 
        // Return the session ID to the client
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
module.exports = {paymentByStripe}