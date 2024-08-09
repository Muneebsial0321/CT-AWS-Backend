const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const eventSchema = new Schema({
  _id: {
    type: String,
    hashKey: true
  },          
  eventTitle: {
    type: String,
  },
  eventDescription: {
    type: String,
  },
  eventCatagory: {
    type: String,
  },
  eventDate: {
    type: String,
  },
  eventLocation: {
    type: String,
  },
  eventFormat: {
    type: String,
  },
  eventType: {
    type: String,
  },
  eventDuration: {
    type: String,
  },
  eventNO_of_People: {
    type: String,
  },
  eventTicketType: {
    type: String,
  },
  eventNetworkOps: {
    type: String,
  },
  eventCoverImg: {
    type: String,
  },
  eventCoverUrl: {
    type: String,
  },
  eventPrivacySettings: {
    type: String,
  },
  eventBusinessLink: {
    type: String,
  },
  eventFamilyName: {
    type: String,
  },
  eventSpeakersName: {
    type: String,
  },



});

const Event = dynamoose.model('Events', eventSchema);

module.exports = Event;
// {
//     "eventTitle": "Tech Conference",
//     "eventDescription": "A gathering of tech enthusiasts",
//     "eventCategory": "Technology",
//     "eventDate": "2024-11-15",
//     "eventLocation": "Faisalabad Expo Center",
//     "eventFormat": "In-person",
//     "eventType": "Conference",
//     "eventDuration": "2 days",
//     "eventNoOfPeople": "1000",
//     "eventTicketType": "Paid",
//     "eventNetworkOps": "Wi-Fi available"
//   }
