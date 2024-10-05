const dynamoose = require('dynamoose');


const wishSchema = new dynamoose.Schema({
_id:{
    type:String,
    hashKey:true
},
wishItemType:String,//podcast , video , event , job  etc
wishItemId:String,
userId:String,
}, {
  timestamps: true
});

const Wish = dynamoose.model('WishLists', wishSchema);

module.exports = Wish;
