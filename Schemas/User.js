const dynamoose = require('dynamoose');

const userSchema = new dynamoose.Schema({
    
    Users_PK : {
        type: String,
        hashKey: true,
    },
    name: {
        type: String,
        // required: true,
    },
    email: {
        type: String,
        // required: true,
    },
    password: {
        type: String,
    },
    work_experience: {
        type: String,

    },
    education: {
        type: String,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    number: {
        type: String,
    },
    description: {
        type: String,
    },
    role: {
        type: String,
        // default: "user"
    },
    picName:String,
    picUrl:String,
});

const User = dynamoose.model('Users', userSchema);

module.exports = User;
