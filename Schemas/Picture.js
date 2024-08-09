const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const picSchema = new Schema({
picName:String,
userId:String,
picUrl:String,
}, {
  timestamps: true
});

const Pic = dynamoose.model('Pictures', picSchema);

module.exports = Pic;
