const Event = require('../Schemas/Events');
const Job = require('../Schemas/Jobs');
const Podcast = require('../Schemas/Podcast');
const Video = require('../Schemas/Videos');
const WishList = require('../Schemas/WishList');
const { v4: uuidv4 } = require('uuid');

// Create a new wishlist item
const createWishListItem = async (req, res) => {
    try {
        const _id = uuidv4();
        const newWishListItem = new WishList({_id,...req.body});
        const savedWishListItem = await newWishListItem.save();
        res.status(201).json(savedWishListItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a specific wishlist item by ID
const getAllWishLists = async (req, res) => {
    try {
        const data = await fun()
        res.json({count:data.length,data});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getWishListItemById = async (req, res) => {
    try {
        const wishListItem = await WishList.get(req.params.id);
        if (!wishListItem) {
            return res.status(404).json({ message: 'WishList item not found' });
        }
        res.status(200).json(wishListItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a wishlist item by ID
const deleteWishListItem = async (req, res) => {
    try {
        await WishList.delete(req.params.id);
        res.status(204).json({ message: 'WishList item deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const fun=async()=>{
    const wishListItem = await WishList.scan().exec()
    let job = await Promise.all(wishListItem.map(async(e)=>{
        if(e.wishItemType=='job'){
            const job = await Job.get(e.wishItemId)
            return job
        }
        else{
            null
        }
     
    
    
    }))
    let event =await Promise.all(wishListItem.map(async(e)=>{
        if(e.wishItemType=='event'){
            const event = await Event.get(e.wishItemId)
            return event
        }
        else{
            null
        }
     
    }))
    let video =await Promise.all(wishListItem.map(async(e)=>{
        if(e.wishItemType=='video'){
            const video = await Video.get(e.wishItemId)
            const com = await Reviews.scan('reviewItemId').eq(video._id).exec()
            return {...video,reviews:com}
        }
        else{
            null
        }
     
    
    
    }))
    let podcast =await Promise.all(wishListItem.map(async(e)=>{
        if(e.wishItemType=='podcast'){
            const podcast = await Podcast.get(e.wishItemId)
            return podcast
        }
        else{
            null
        }
     
    
    
    }))

    job= job.filter((e)=>e!=null)
    event= event.filter((e)=>e!=null)
    podcast= podcast.filter((e)=>e!=null)
    video= video.filter((e)=>e!=null)
    return {job,event,podcast,video }
}


module.exports = {createWishListItem,deleteWishListItem,getWishListItemById,getAllWishLists}
