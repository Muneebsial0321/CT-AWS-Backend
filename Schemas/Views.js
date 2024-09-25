const dynamoose = require('dynamoose');


const viewSchema = new dynamoose.Schema({
_id:{
    type:String,
    hashKey:true
},
viewItemType:String,//podcast , videos , events etc
viewItemId:String,
viewerId:String,
}, {
  timestamps: true
});

const View = dynamoose.model('Views', viewSchema);

module.exports = View;
