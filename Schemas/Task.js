const dynamoose = require('dynamoose');


const taskSchema = new dynamoose.Schema({
_id:String,
taskName:String,
taskDesc:String,
taskStatus:String,
taskDeadLine:String,

}, {
  timestamps: true
});

const Task = dynamoose.model('Audio', taskSchema);

module.exports = Task;
