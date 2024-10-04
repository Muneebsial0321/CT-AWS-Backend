require('dotenv').config
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
// Mock database


const products = [
  {
    name: 'Premium Ticket',
    price: 100, // Price in dollars (10.00 USD)
    quantity: 3, // Number of items for this product
  },
  {
    name: 'Basic Ticket',
    price: 50, // Price in dollars (50.00 USD)
    quantity: 1, // Number of items for this product
  },
];
const lineItems = products.map((product) => ({
  price_data: {
    currency: 'usd', // Use the appropriate currency
    product_data: {
      name: product.name, // Dynamically set the product name
      description:product._id
    },
    unit_amount: product.price * 100, // Stripe expects the amount in cents (for USD)
  },
  quantity: product.quantity, // Quantity of the product
}));

const paymentByStripe = async (req, res) => {

  // const event = await Event.get(req.params.id);
  // const seller = await User.get(userWhoCreatedEventID);
  // const buyer = await User.get(req.body.id);
    // let userWhoCreatedEventID = event.eventCreatedBy;
    // let userWhoBoughtTicket = 'some name';
    // let eventID = event._id;
    // let eventPrice = event.eventTicketPrice;
    const sellerID = 'userWhoCreatedEventID';
    const buyerName = 'some name';
    const eventID = 'event_id';
    const eventPrice = 50;
    const ticketId = 'ticket_2'; // Use ticket_2 for testing purposes
    const user = {email:"some email"}
    const destination = {email:"some email"}
    // const ticket = tickets.get(ticketId);
    // if (!ticket) {
    //   return res.status(404).json({ error: 'Ticket not found' });
    // }
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:lineItems,
        // line_items: [
        //   {
        //     price_data: {
        //       currency: 'usd',
        //       product_data: {
        //         name: `Event ID: ${eventID}`, // 
        //         description: `\n\n\n\n\n\n\n\n
        //         *USER ID*: ${userWhoCreatedEventID}\n\n
        //         *EMAIL*: ${user.email}\n\n`
            
        //       },
        //       unit_amount: parseInt(eventPrice)*100, // Ticket price in cents
        //     },
        //     quantity: 1,
        //   },
        // ],
        mode: 'payment',
        success_url: `${process.env.FRONT_URL}/paymentSuccess`, // Redirect after successful payment
        cancel_url: `${process.env.FRONT_URL}/paymentfailed`, // Redirect after canceled payment
        payment_intent_data: {
          transfer_data: {
            destination: 'acct_1Ppi8ZRtoFwfpEcp', // Seller's Stripe Account ID
          },
          metadata: {
            ticketEventId:eventID, 
            ticketSellerId: userWhoCreatedEventID,
            ticketSellerEmail:user.email,
            ticketBuyerId: userWhoBoughtTicket
          },
     
        },
      }); 
  // console.log(session)
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