const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const podcastSchema = new Schema({
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
        type: [String],
    }
}, {
    timestamps: true
});

const Podcast = dynamoose.model('Podcast', podcastSchema);

module.exports = Podcast;
