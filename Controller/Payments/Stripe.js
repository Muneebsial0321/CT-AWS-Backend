require('dotenv').config
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
const jwt = require('jsonwebtoken');

const jwtGen = (data) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' });
  

const ticketPrice = (ticketName, ticketArray) => {
  const ticket = ticketArray.filter((e) => e.ticketType == ticketName)
  return ticket[0].price
}
const getLineItems = (proArray, event) => {
  // prodArray will have ticket name with there quantity.....
  //meanwhile event will have event object
  // it shall return lineitems
  const lineItems = proArray.map((product) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name_,
        description: event._id
      },
      unit_amount: ticketPrice(product.name_, event.eventTicketArray) * 100,
    },
    quantity: product.quantity,
  }));

  const filteredData = lineItems.filter((e) => e.quantity != 0)
  return filteredData

}

const paymentByStripe = async (req, res) => {
  const event = await Event.get(req.body.eventId);
  const seller = await User.get(event.eventCreatedBy);
  const products = Object.entries(req.body.eventTicketArray).map(([name_, quantity]) => ({ name_, quantity }));
  const eventID = req.body.eventId;
  const sellerID = seller.Users_PK;
  const buyerID = req.body.buyerId;
  const metadata = {
    ticketEventId: eventID,
    ticketSellerId: sellerID,
    ticketSellerEmail: seller.email,
    ticketBuyerId: buyerID
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: getLineItems(products, event),
      mode: 'payment',
      success_url: `https://api.teqtak.com/tickets/gen?token=${jwtGen(metadata)}`, // Redirect after successful payment
      cancel_url: `${process.env.FRONT_URL}/paymentfailed`, // Redirect after canceled payment
      payment_intent_data: {
        transfer_data: {
          destination: 'acct_1Ppi8ZRtoFwfpEcp', // Seller's Stripe Account ID
        },
        metadata:metadata,

      },
    });
    res.json({
      sessionId: session,
      // url: session.url
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

module.exports = { paymentByStripe}