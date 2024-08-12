const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const chatRoomSchema = new Schema({
  _id:{
   type:String,
   hashKey:true
  },
  users: {
    type: [String],
    required: true
  },
  messages: [{
    type:Object,
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


const ChatRoom = dynamoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;