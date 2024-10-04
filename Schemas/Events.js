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
  eventCreatedBy: {
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
  eventTicketPrice: {
    type: Number,
  },
  eventSpeakersName: {
    type: String,
  },
  eventArray: {
    type: Array,
    schema:[String],
  },
  generalTicket:Number,
  premiumTicket:Number,
  vipTicket:Number,
  startTime:String,
  endTime:String,
  mediaFiles: {
    type: Array,
    schema: [
      {
        type: Object,
        eventMediaName: String,
        eventMediaUrl: String,
    
      },
    ], 
  },



});

const Event = dynamoose.model('Events', eventSchema);

module.exports = Event;
// {
  // "_id": "e1fddf8c-b8c2-4d54-8769-4b7a0b69f1b5",
  // "eventTitle": "Tech Innovators Conference 2024",
  // "eventCreatedBy": "7e3fceb1-0bd2-4f7f-bf81-3bed717bead6",
  // "eventDescription": "A conference bringing together leading tech innovators to discuss the future of technology.",
  // "eventCatagory": "Conference",
  // "eventDate": "2024-10-15",
  // "eventLocation": "San Francisco, CA",
  // "eventFormat": "In-Person",
  // "eventType": "Technology",
  // "eventDuration": "3 Days",
  // "eventNO_of_People": "500",
  // "eventTicketType": "Paid",
  // "eventNetworkOps": "Available",
  // "eventPrivacySettings": "Public",
  // "eventBusinessLink": "https://example.com/tech-innovators",
  // "eventFamilyName": "Innovators",
  // "eventTicketPrice": 299.99,
  // "eventSpeakersName": "Jane Smith, Bob Johnson",
//
// },