require('dotenv').config
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
const jwt = require('jsonwebtoken');
// Mock database

// event id e12345



const jwtDataCreater=(data)=>{
const token = jwt.sign(data,process.env.JWT_SECRET, { expiresIn: '1h' });
return token
}
const getLineItems=(proArray,event)=>{
// prodArray will have ticket name with there quantity.....
//meanwhile event will have event object
// it shall return lineitems
  const lineItems = proArray.map((product) => ({
    price_data: {
      currency: 'usd', // Use the appropriate currency
      product_data: {
        name: product.name_, // Dynamically set the product name
        description:event._id
      },
      unit_amount: event[product.name_] * 100, // Stripe expects the amount in cents (for USD)
      // unit_amount: product.price * 100, // Stripe expects the amount in cents (for USD)
    },
    quantity: product.quantity, // Quantity of the product
  }));

  const filteredData= lineItems.filter((e)=>e.quantity!=0)
  return filteredData

}

const paymentByStripe = async (req, res) => {

    const event = await Event.get(req.body.eventId);
    const seller = await User.get(event.eventCreatedBy);
    // const products = req.body.ticketArray
    // const products = Object.entries(req.body.ticketArray)
    const products = Object.entries(req.body.ticketArray).map(([name_,quantity]) => ({ name_, quantity }));

    const eventID = req.body.eventId ;
    const sellerID = seller.Users_PK;
    const buyerID = req.body.buyerId;

   
    console.log({token: jwtDataCreater({products,
      sellerID,
      eventID,
      buyerID,
    })})
    
    // if (!ticket) {
    //   return res.status(404).json({ error: 'Event not found' });
    // } 
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items:getLineItems(products,event),
        mode: 'payment',
        success_url: `${process.env.FRONT_URL}/paymentSuccess?token=${jwtDataCreater({products,sellerID,eventID,buyerID,})}`, // Redirect after successful payment
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
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  }
  
module.exports = {paymentByStripe}