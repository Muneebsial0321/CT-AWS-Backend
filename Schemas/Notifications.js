const dynamoose = require('dynamoose');


const notSchema = new dynamoose.Schema({
_id:{
    type:String,
    hashKey:true

},
createdBy:String,
for:String,
notiTitle:String,
notiDesc:String,
}, {
  timestamps: true
});

const Notification = dynamoose.model('Notifications', notSchema);

module.exports = Notification;
