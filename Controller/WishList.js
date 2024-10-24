const Event = require('../Schemas/Events');
const Job = require('../Schemas/Jobs');
const Podcast = require('../Schemas/Podcast');
const User = require('../Schemas/User');
const Video = require('../Schemas/Videos');
const Reviews = require('../Schemas/Reviews');
const WishList = require('../Schemas/WishList');
const { v4: uuidv4 } = require('uuid');

// Create a new wishlist item
const createWishListItem = async (req, res) => {
    try {
            const check = await WishList.scan()
                .where('wishItemId').eq(req.body.wishItemId)
                .where('userId').eq(req.body.userId).exec()
            if(check && check.length>0){
                res.json({message:"already present"})
            }
            else{
                const _id = uuidv4();
                const newWishListItem = new WishList({ _id, ...req.body });
                const savedWishListItem = await newWishListItem.save();
                res.status(201).json(savedWishListItem);
            }
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    // Get a specific wishlist item by ID
    const getAllWishLists = async (req, res) => {
        try {
            const wishListItem = await WishList.scan().exec()
            res.json({ wishListItem, count: wishListItem.length });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
    const getWishListItemById = async (req, res) => {
        try {
            const wishListItem = await WishList.scan('userId').eq(req.params.id).exec()
            const data = await fun(wishListItem)
            res.json(data);
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


    const fun = async (wishListItem) => {
        try {



            let job = await Promise.all(wishListItem.map(async (e) => {
                if (e.wishItemType == 'job') {
                    const job = await Job.get(e.wishItemId)
                    return job
                }
                else {
                    null
                }



            }))
            let event = await Promise.all(wishListItem.map(async (e) => {
                if (e.wishItemType == 'event') {
                    const event = await Event.get(e.wishItemId)
                    return event
                }
                else {
                    null
                }

            }))
            let video = await Promise.all(wishListItem.map(async (e) => {
                if (e.wishItemType == 'video') {
                    const video = await Video.get(e.wishItemId)
                    const com = await Reviews.scan('reviewItemId').eq(video._id).exec()
                    const { password, ...user } = await User.get(vid.userId);
                    return { data: vid, commments: com, user: user }
                }
                else {
                    return null
                }
            }))
            let podcast = await Promise.all(wishListItem.map(async (e) => {
                if (e.wishItemType == 'podcast') {
                    const podcast = await Podcast.get(e.wishItemId)
                    if (podcast) {
                        const com = await Reviews.scan('reviewItemId').eq(podcast._id).exec()
                        const { password, ...user } = await User.get(podcast.userID);
                        return { data: podcast, commments: com, user: user || null }
                    }
                    else {
                        return null
                    }
                }
            }))

            job = job.filter((e) => e != null)
            event = event.filter((e) => e != null)
            podcast = podcast.filter((e) => e != null)
            video = video.filter((e) => e != null)
            return { job, event, podcast, video }
        } catch (error) {
            console.log({ error })
        }
    }

    const videoDataGenerator = async (vidoes) => {
        // const vidoes = await Video.scan().exec()
        const data = await Promise.all(vidoes.map(async (e) => {
            const vid = await Video.get(e._id)
            const com = await Reviews.scan('reviewItemId').eq(e._id).exec()
            const { password, ...user } = await User.get(vid.userId);
            return { data: vid, commments: com, user: user }
        }))
        return data

    }


    module.exports = { createWishListItem, deleteWishListItem, getWishListItemById, getAllWishLists }
