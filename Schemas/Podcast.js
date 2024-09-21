const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const podcastSchema = new Schema({
    _id: {
        type: String,
        hashKey: true
    },
    userID: {
        type: String,
    },

    episodeTitle: {
        type: String,
    },

    episodeDescription: {
        type: String,
    },

    podcastType: {
        type: String,
    },
    seasonNumber: {
        type: Number,
    },
    episodeNumber: {
        type: Number,
    },
    speakers: {
        type:String
    },
    familyName:String,
    audioName:String,
    picName:String,
    picUrl:String,
    audioUrl:String,
    podcastDuration:String,
    speakerArray:{
        type:Array,
        schema:[String],
    }
});

const Podcast = dynamoose.model('Podcasts', podcastSchema);

module.exports = Podcast;
// {
//     "publisher": "7e3fceb1-0bd2-4f7f-bf81-3bed717bead6",
//     "episodeTitle": "The Future of AI",
//     "episodeDescription": "In this episode, we dive deep into the advancements in artificial intelligence and its impact on various industries.",
//     "podcastType": "Technology",
//     "seasonNumber": 3,
//     "episodeNumber": 7,
//     "speakers": "John Doe",
//     "audioName": "future_of_ai_episode_7.mp3",
//     "picName": "ai_podcast_cover.jpg",
//     "picUrl": "https://example.com/images/ai_podcast_cover.jpg",
//     "audioUrl": "https://example.com/audio/future_of_ai_episode_7.mp3"
//   }
  