const dynamoose = require('dynamoose');


const audioSchema = new dynamoose.Schema({
audioName:String,
userId:String,
audioUrl:String,
}, {
  timestamps: true
});

const Audio = dynamoose.model('Audio', audioSchema);

module.exports = Audio;
