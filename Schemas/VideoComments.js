const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const comSchema = new Schema({
_id:{
    type:String,
    hashKey:true
},
postedByUserId:String,
onVideoId:String,
message:String
}, {
  timestamps: true
});

const Comment = dynamoose.model('Comments', comSchema);

module.exports = Comment
