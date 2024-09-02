const dynamoose = require('dynamoose');


const meetingSchema = new dynamoose.Schema({
_id:{
    type:String,
    hashKey:true
},
chatroomID:String
}, {
  timestamps: true
});

const Meeting = dynamoose.model('Meeting', meetingSchema);

module.exports = Meeting;
