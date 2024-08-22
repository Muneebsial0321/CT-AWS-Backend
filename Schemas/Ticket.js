const dynamoose = require('dynamoose');


const ticketSchema = new dynamoose.Schema({
_id:String,
ticketEventId:String,
ticketBuyerId:String,
ticketSellerId:String,
ticketSellerEmail:String,
ticketReceiptUrl:String,

}, {
  timestamps: true
});

const Ticket = dynamoose.model('Tickets', ticketSchema);

module.exports = Ticket;
