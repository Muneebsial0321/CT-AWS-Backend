const dynamoose = require('dynamoose');


const reportSchema = new dynamoose.Schema({
    _id: {
        type: String,
        hashKey: true
    },
    userId: String,
    reportItemId: String,
    reportType:String,
    reportMessage: String,

}, {
    timestamps: true
});

const Review = dynamoose.model('Reviews', reportSchema);

module.exports = Review;
