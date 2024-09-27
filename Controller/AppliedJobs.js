const { v4: uuidv4 } = require('uuid'); // Ensure you have uuid installed
const AppliedJobs = require('../Schemas/AppliedJobs'); // Adjust the path according to your project structure

const createJobApplication = async (req, res) => {
  try {
    let data = {...req.body}
    if(req.file){
        const resumeName = req.file.key
        const resumeUrl = req.file.location
        data = {...data,resumeName,resumeUrl} 
    }
    const _id = uuidv4(); // Generate a unique ID
    const newApplication = new AppliedJobs({_id,...data });
    const savedApplication = await newApplication.save();
    res.status(201).json({message:"success",data:savedApplication});
  } catch (error) {
    console.error('Error creating job application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllJobApplications = async (req, res) => {
  try {
    const jobApplications = await AppliedJobs.scan().exec();
    res.json({count:jobApplications.length,data:jobApplications});
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const app = await AppliedJobs.scan('jobId')
    .eq(req.params.id)
    .exec()
    if (!app) {
      return res.status(404).json({ error: 'Job Application not found' });
    }
    res.status(200).json({count:app.length,data:app});
  } catch (error) {
    console.error('Error fetching job application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const existingApplication = await AppliedJobs.get(id);
    if (!existingApplication) {
      return res.status(404).json({ error: 'Job Application not found' });
    }

    await AppliedJobs.delete(id);
    res.status(204).send(); // Successfully deleted, no content
  } catch (error) {
    console.error('Error deleting job application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createJobApplication,
  getAllJobApplications,
  getJobApplications,
  deleteJobApplication,
};
