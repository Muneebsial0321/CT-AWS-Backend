const dynamoose = require('dynamoose');


const replySchema = new dynamoose.Schema({
_id:String,
reviewId:String,
replyMessage:Number,


}, {
  timestamps: true
});

const Reply = dynamoose.model('Replys', replySchema);

module.exports = Replys;
