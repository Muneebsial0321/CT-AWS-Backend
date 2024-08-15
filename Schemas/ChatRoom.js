const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const chatRoomSchema = new Schema({
  _id: {
    type: String,
    hashKey: true
  },
  users: {
    type: Array,
    schema: [String], // Array of strings for user IDs
    required: true
  },
  messages: {
    type: Array,
    schema: [{
      type: Object,
      schema: {
        messageId: {
          type: String,
          required: true
        },
        sender: {
          type: String,
          required: true
        },
        message: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    }]
  }
}, {
  timestamps: true
});

const ChatRoom = dynamoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
//  728bd845-a3de-4d17-babd-4e7d87cbce69