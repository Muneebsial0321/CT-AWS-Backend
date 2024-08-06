const { v4: uuidv4 } = require('uuid');
const Job = require('../Schemas/Jobs')


const createJob = async(req,res)=>{
    try {
        console.log(req.body)
       const _id = uuidv4();
        const newJob = new Job({ _id,...req.body});
        await newJob.save();
        res.status(201).json(newJob);
        // res.json(req.body)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getJob= async (req, res) => {
    try {
        const job = await Job.get(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllJobs= async (req, res) => {
    try {
        const jobs = await Job.scan().exec();
        res.status(200).json({count:jobs.length,data:jobs});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateJob=  async (req, res) => {
    try {
        console.log(req.body)
    
        const job = await Job.update({ _id: req.params.id },req.body);
        res.status(200).json(job);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message:error.message });
    }
}
const deleteJob=  async (req, res) => {
    try {
        await Job.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const searchJob= async( req,res)=>{}

module.exports= {createJob,updateJob,getAllJobs,getJob,updateJob,deleteJob}