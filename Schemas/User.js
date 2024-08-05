const dynamoose = require('dynamoose');

const userSchema = new dynamoose.Schema({
    id: {
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
        // required: true,
    },
    work_experience: {
        type: String,
        // required: true,
    },
    education: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        // required: true,
    },
    country: {
        type: String,
        // required: true,
    },
    number: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true,
    },
    role: {
        type: String,
        // default: "user"
    }
});

const User = dynamoose.model('User', userSchema);

module.exports = User;
