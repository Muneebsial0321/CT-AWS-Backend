const dynamoose = require('dynamoose');


const replySchema = new dynamoose.Schema({
_id:String,
reviewId:String,
userId:String,
replyMessage:String,


}, {
  timestamps: true
});

const Reply = dynamoose.model('Replys', replySchema);

module.exports = Reply;
