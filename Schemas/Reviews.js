const dynamoose = require('dynamoose');


const reviewSchema = new dynamoose.Schema({
_id:String,
userId:String,
reviewItemId:String,
reviewRatings:Number,
reviewMessage:String,

}, {
  timestamps: true
});

const Review = dynamoose.model('Reviews', reviewSchema); 

module.exports = Review;
