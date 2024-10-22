require('dotenv').config
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Event = require('../../Schemas/Events')
const User = require('../../Schemas/User')
const jwt = require('jsonwebtoken');
// Mock database

// event id e12345



const jwtGen = (data) => jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' });
  

const ticketPrice = (ticketName, ticketArray) => {
  console.log({ ticketName, ticketArray })
  const ticket = ticketArray.filter((e) => e.ticketType == ticketName)
  console.log({ ticket })
  console.log({ price: ticket[0].price })
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
const userAgent = async (req, res) => {
  console.log(req.headers)
  res.json({ userAgent: req.headers['user-agent'] })
}
const paymentByStripe = async (req, res) => {
  const event = await Event.get(req.body.eventId);
  const seller = await User.get(event.eventCreatedBy);
  const products = Object.entries(req.body.eventTicketArray).map(([name_, quantity]) => ({ name_, quantity }));
  // const products = req.body.eventTicketArray.map((e) => {
  //   const key = Object.keys(e)[0]
  //   const value = e[Object.keys(e)[0]]
  //   // console.log({ [key]: value })
  //   return {
  //     name_: key,
  //     quantity: value
  //   }

  // })
  // const eventTicketArray = event.eventTicketArray.map((e) => {
  //   const key = e.ticketType
  //   const value = e.quantity
  //   return {
  //     [key]: value
  //   }
  // })
  // res.json({ products, eventTicketArray,lineItems:getLineItems(products,event) })
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
      // line_items:[ {
      //   price_data: {
      //     currency: 'usd',
      //     product_data: {
      //       name: "Product name",
      //     },
      //     unit_amount: 100 * 100,
      //   },
      //   quantity: 10,
      // }],
      line_items: getLineItems(products, event),
      mode: 'payment',
      // success_url: `${process.env.FRONT_URL}/paymentSuccess?token=${jwtDataCreater({products,sellerID,eventID,buyerID,})}`, // Redirect after successful payment
      success_url: `https://api.teqtak.com/tickets/gen?token=${jwtGen(metadata)}`, // Redirect after successful payment
      // success_url: `${process.env.FRONT_URL}/ticketdetails?eventid=${eventID}&buyerid=${buyerID}`, // Redirect after successful payment
      cancel_url: `${process.env.FRONT_URL}/paymentfailed`, // Redirect after canceled payment
      payment_intent_data: {
        transfer_data: {
          destination: 'acct_1Ppi8ZRtoFwfpEcp', // Seller's Stripe Account ID
        },
        metadata: {
          ticketEventId: eventID,
          ticketSellerId: sellerID,
          ticketSellerEmail: seller.email,
          ticketBuyerId: buyerID
        },

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

module.exports = { paymentByStripe, userAgent }