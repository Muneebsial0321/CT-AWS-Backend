const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const videoSchema = new Schema({
videoName:String,
userId:String,
videoUrl:String,
videoDesc:String,
videoVisibility:String,
videoRating:String,
}, {
  timestamps: true
});

const Video = dynamoose.model('Video', videoSchema);

module.exports = Video;