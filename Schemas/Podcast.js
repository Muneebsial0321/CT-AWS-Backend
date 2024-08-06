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
    audio: {
        type: String,
    },
    customizeCover: {
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
    }
});

const Podcast = dynamoose.model('Podcasts', podcastSchema);

module.exports = Podcast;
