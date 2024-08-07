const dynamoose = require('dynamoose');

const subscriptionSchema = new dynamoose.Schema({
    _id: {
        type: String,
        hashKey: true,
    },
    subscriberId: {
        type: String,
    },
    subscribedToId: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Subscription = dynamoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
