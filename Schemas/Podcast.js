const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const podcastSchema = new Schema({
    _id: {
        type: String,
        hashKey: true
    },
    publisher: {
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
        type: Array,
        schema: [String],
    },
    audioName:String,
    picName:String,
    picUrl:String,
    audioUrl:String
});

const Podcast = dynamoose.model('Podcasts', podcastSchema);

module.exports = Podcast;
