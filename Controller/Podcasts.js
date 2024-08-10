const { v4: uuidv4 } = require('uuid');
const Podcast = require('../Schemas/Podcast')


const createPodcast = async(req,res)=>{
    try {
        console.log(req.files)
        const picName = req.files.image[0].key || ''
        const picUrl =  req.files.image[0].location || ''
  
        const audioName = req.files.audio[0].key || ''
        const audioUrl =  req.files.audio[0].location || ''
  console.log({picName,audioName,audioUrl,picUrl})
        //  console.log(req.params.id)
       const _id = uuidv4();
        const newPodcast = new Podcast({ _id,...req.body,audioName,audioUrl,picName,picUrl});
        await newPodcast.save();
        res.status(201).json(newPodcast);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getPodcast= async (req, res) => {
    try {
        const podcast = await Podcast.get(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        res.status(200).json(podcast);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllPodcasts= async (req, res) => {
    try {
        const podcasts = await Podcast.scan().exec();
        res.status(200).json({count:podcasts.length,data:podcasts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updatePodcast=  async (req, res) => {
    try {
        console.log(req.body)
    
        const podcast = await Podcast.update({ _id: req.params.id },req.body);
        res.status(200).json(podcast);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message:error.message });
    }
}
const deletePodcast=  async (req, res) => {
    try {
        await Podcast.delete(req.params.id);
        res.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports= {createPodcast,updatePodcast,getAllPodcasts,getPodcast,deletePodcast}