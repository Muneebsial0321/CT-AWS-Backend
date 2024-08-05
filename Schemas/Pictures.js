const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const pictureSchema = new Schema({
pictureName:String,
userId:String,
pictureUrl:String,
}, {
  timestamps: true
});

const Picture = dynamoose.model('Picture', pictureSchema);

module.exports = Picture;
