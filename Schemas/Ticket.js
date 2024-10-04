const dynamoose = require('dynamoose');


const ticketSchema = new dynamoose.Schema({
_id:{
  type:String,
  hashKey:true
},
ticketEventId:String,
ticketBuyerId:String,
ticketSellerId:String,
ticketSellerEmail:String,
ticketReceiptUrl:String,
ticketType:String,
ticketQuantity:String,

}, {
  timestamps: true
});

const Ticket = dynamoose.model('Tickets', ticketSchema);

module.exports = Ticket;
