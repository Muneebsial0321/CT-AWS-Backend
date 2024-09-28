const { v4: uuidv4 } = require('uuid');
const Job = require('../Schemas/Jobs')
const User = require('../Schemas/User')
const find = require('../Functions/find')


const createJob = async (req, res) => {
    try {
        let data = {...req.body}
        if(req.file){
            const logoName = req.file.key
            const logoUrl = req.file.location
            data = {...data,logoName,logoUrl} 
        }
        const _id = uuidv4();
        const newJob = new Job({ _id, ...data });
        await newJob.save();
        res.status(201).json({ message: "success", data: newJob });
        // res.json(req.body)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getJob = async (req, res) => {
    try {
        const job = await Job.get(req.params.id);
        const user_ = await User.get(job.userId);
        const { picUrl,name, Users_PK} = user_
        const poster = { picUrl,name ,Users_PK }
        if (!job) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({poster, job});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.scan().exec();
        const poster = await Promise.all(jobs.map(async (e) => {
            if (e.userId) {
                const { name, picUrl } = await User.get(e.userId);
                return { poster: { name, picUrl }, ...e }
            }
            else {
                return {
                    poster: {
                        name: '',
                        picUrl: ''
                    }
                    , ...e
                }
            }
        }))
        res.status(200).json({ count: poster.length, data: poster });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateJob = async (req, res) => {
    try {
        console.log(req.body)

        const job = await Job.update({ _id: req.params.id }, req.body);
        res.status(200).json(job);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const deleteJob = async (req, res) => {
    try {
        await Job.delete(req.params.id);
        res.json({ message: 'Job deleted successfully', jobId: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const searchJob = async (req, res) => {
    let result = await find_(req.body)
    console.log(result)
    res.json(result)
}

async function find_(params) {
    let scan = await Job.scan();
    console.log(scan)
    console.log(params)

    for (const key in params) {
        if (params[key]) {
            scan = await scan.where(key).eq(params[key]);
            console.log(scan)
        }
    }

    const result = await scan.exec();
    console.log(result)
    return { count: result.length, data: result };
}

module.exports = { createJob, updateJob, getAllJobs, getJob, updateJob, deleteJob, searchJob }