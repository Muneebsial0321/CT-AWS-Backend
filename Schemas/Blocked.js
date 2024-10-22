const dynamoose = require('dynamoose');


const BlockedUserSchema = new dynamoose.Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    required: true, 
  },
  blockedId: {
    type: String,
    required: true, 
  }
}, {
  timestamps: true
});

// Create model
const Blocked = dynamoose.model('Blocked', BlockedUserSchema);

module.exports = Blocked;
