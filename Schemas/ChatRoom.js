const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const chatRoomSchema = new Schema({
  users: {
    type: [String],
    // validate: [arrayLimit, '{PATH} exceeds the limit of 2'],
    required: true
  },
  messages: [{
    sender:String,
    message:String,
   timestamp: {
    type: Date,
    default: Date.now
  } 
  },
  ]
}, {
  timestamps: true
});

// function arrayLimit(val) {
//   return val.length === 2;
// }

const ChatRoom = dynamoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;