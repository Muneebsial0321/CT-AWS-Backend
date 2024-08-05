const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;

const jobSchema = new Schema({
  jobTitle: {
    type: String,
    // required: true,
    // trim: true
  },
  educationLevel: {
    type: String,
    // required: true
  },
  jobDescription: {
    type: String,
    // required: true
  },
  companySize: {
    type: String,
    // required: true
  },
  jobCategory: {
    type: String,
    // required: true
  },
  workplaceType: {
    type: String,
    // required: true
  },
  location: {
    type: String,
    // required: true
  },
  skills: {
    type: [String],
    // required: true
  },
  jobType: {
    type: String,
    // required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  experienceLevel: {
    type: String,
    // required: true
  },
  languages: {
    type: [String],
    // required: true
  },
  salaryRange: {
    type: String,
    // required: true
  },
  jobShift: {
    type: String,
    // required: true
  },
  travelRequirement: {
    type: String,
    // required: true
  }
}, {
  timestamps: true
});

const Job = dynamoose.model('Job', jobSchema);

module.exports = Job;
