const { v4: uuidv4 } = require('uuid');
const Podcast = require('../Schemas/Podcast');
const { response } = require('express');
const mm = require('music-metadata');
const User = require('../Schemas/User');


const createPodcast = async (req, res) => {
    try {
        console.log("creating podcast")
        let data = { ...req.body }
        const speakerArray = req.body.eventArray?JSON.parse(req.body.speakerArray):[];
        if (req.files != null) {
            if (req.files.image!= null) {
                const picName = req.files.image[0].key
                const picUrl = req.files.image[0].location
                data = { ...data, picName, picUrl }
                // console.log({ picUrl, picName })
                // console.log({data})

            }
            if (req.files.audio!= null) {
                // console.log("no audio")
                const audioName = req.files.audio[0].key
                const audioUrl = req.files.audio[0].location
                console.log({adudioFIleis:req.files.audio[0]})
                data = { ...data, audioUrl, audioName }
            } 
        }
        const _id = uuidv4();
        const seasonNumber = req.body.seasonNumber && +req.body.seasonNumber
        const episodeNumber  = req.body.episodeNumber &&  +req.body.episodeNumber 
        const podcastDuration  = req.body.podcastDuration &&  +req.body.podcastDuration 
        // console.log({seasonNumber,episodeNumber})
        const podcast = new Podcast({_id,...data,seasonNumber,episodeNumber,podcastDuration,speakerArray})
        await podcast.save() 
        res.json({message:"success",data:podcast})
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const getPodcast = async (req, res) => {
    try {
        const podcast = await Podcast.get(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        const speaker =podcast.speakerArray?podcast.speakerArray:[]
        const users = await Promise.all(speaker.map(async(e)=>{
           const {password,...d} =  await User.get(e)
           return d 
            }))
        console.log({speaker,users})
        res.status(200).json({...podcast,speakers:users});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllPodcasts = async (req, res) => {
    try {
        const podcasts = await Podcast.scan().exec();
        const data = await Promise.all(podcasts.map(async(e)=>{
            try {
                const user = await User.get(e.userID);
                // console.log({user})
                return {
                    ...e,
                    user: user || null // If user doesn't exist, set to null
                };
            } catch (userError) {
                // // Handle any errors in fetching the user, e.g. if User.get fails
                // console.error(`Error fetching user with ID ${e.userID}:`, userError);
                return {
                    ...e,
                    user: null // Set user as null if not found or any error occurs
                };
            // if (user) {
            //     return {
            //         ...e,
            //         user
            //     };
            // }
            // return {...e}; 
     } }))
        res.status(200).json({ count: data.length, data});
        // res.status(200).json({ count: podcasts.length, podcasts});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const updatePodcast = async (req, res) => {
    try {
        // console.log(req.body)
        const podcast = await Podcast.update({ _id: req.params.id }, req.body);
        res.status(200).json(podcast);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const deletePodcast = async (req, res) => {
    try {
        await Podcast.delete(req.params.id);
        console.log("podcast deleted")
        res.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const searchPodcast = async (req, res) => {
    console.log("searccing")
    let result = await find_(req.body)
    res.json(result)
}

async function find_(params) {
    let scan = await Podcast.scan();
    for (const key in params) {
        if (params[key]) {
            scan = await scan.where(key).eq(params[key]);
        }
    }

    const result = await scan.exec();
    // console.log(result)
    return { count: result.length, data: result };
}



module.exports = { createPodcast, updatePodcast, getAllPodcasts, getPodcast, deletePodcast, searchPodcast }