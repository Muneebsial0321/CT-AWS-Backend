const dynamoose = require('dynamoose');


const appliedJobsSchema = new dynamoose.Schema({
    _id: {
        type: String,
        hashKey: true
    },
    name: String,
    email: String,
    userId: String,
    jobId: String,
    countryCode: String,
    additonalInfo: String,
    phoneNumber: String,
    resumeUrl: String,
    resumeName: String,
}, {
    timestamps: true
});

const AppliedJobs = dynamoose.model('AppliedJobs', appliedJobsSchema);

module.exports = AppliedJobs;
