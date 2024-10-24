const Views = require('../Schemas/Views')
const Videos = require('../Schemas/Videos')
const Podcast = require('../Schemas/Podcast')
const Reviews = require('../Schemas/Reviews')
const User = require('../Schemas/User')
const { v4: uuidv4 } = require('uuid');

const createView = async (req, res) => {
    try {
    const check= await Views.scan()
    .where('viewItemId').eq(req.body.viewItemId)
    .where('viewerId').eq(req.body.viewerId).exec()
    if(check && check.length>0){
        res.json({"message":"already present"})
    }
    else{
    const _id = uuidv4()
    const view = new Views({
        _id, ...req.body
    })
    await view.save()
    res.json({ message: "success", view })
}} catch (error) {
 console.log(error)
 res.json({message:"internal server error"})       
}
}

const getItemViews = async (req, res) => {
    try {
        const view = await Views.scan('viewItemId').eq(req.params.id).exec()
        res.json({ count: view.length, data: view })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }

}

// getting for all vidoes that user watched

const getUserWatchList__lagacy = async (req, res) => {

    try {
        // const view = await Views.scan()
        // .where('viewItemType').eq('video')
        // .where('viewerId').eq(req.params.id)  // takes userID
        // .exec()
        const view = await Views.scan('viewerId')
            .eq(req.params.id)  // takes userID
            .exec()

        const video = view.filter((e) => e.viewItemType == 'video')


        const data = await Promise.all(video.map(async (e) => {
            const vid = await Videos.get(e.viewItemId)
            if (vid) {
                const com = await Reviews.scan('reviewItemId').eq(e._id).exec()
                const { password, ...user } = await User.get(vid.userId);
                return { data: vid, commments: com, user: user }
            }
            else {
                return null
            }
        }
        ))
        const filterData = data.filter((e) => e !== null)
        const podcast = view.filter((e) => e.viewItemType == 'podcast')
        res.json({ video: filterData, podcast })
        // res.json({video:data,podcast})
    } catch (error) {
        console.log({ error })
        res.send(error)
    }

}
const getUserWatchList = async (req, res) => {

    try {
        const view = await Views.scan('viewerId')
            .eq(req.params.id)  // takes userID
            .exec()
        const data = await fun(view)
        res.json(data)
        // res.json({video:data,podcast})
    } catch (error) {
        console.log({ error })
        res.send(error)
    }

}
const getAllViews = async (req, res) => {
    try {
        const view = await Views.scan().exec()
        res.json({ count: view.length, data: view })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}
const deleteView = async (req, res) => { }
const getSingleView = async (req, res) => { }
const fun=async(wishListItem)=>{
    try {
    let video =await Promise.all(wishListItem.map(async(e)=>{
        if(e.viewItemType=='video'){
            const video = await Videos.get(e.viewItemId)
            const com = await Reviews.scan('reviewItemId').eq(video._id).exec()
            const { password, ...user } = await User.get(video.userId);
            return { data: video, commments: com, user: user || null }
        }
        else{
           return null
        }
    }))
    let podcast =await Promise.all(wishListItem.map(async(e)=>{
        if(e.viewItemType=='podcast'){
            const podcast = await Podcast.get(e.viewItemId)
            if(podcast){
                const com = await Reviews.scan('reviewItemId').eq(podcast._id).exec()
                const { password, ...user } = await User.get(podcast.userID);
                return { data: podcast, commments: com, user: user || null}
            }
            else{
                return null
            }
        }
    }))

    podcast= podcast.filter((e)=>e!=null)
    video= video.filter((e)=>e!=null)
    return {podcast,video}
} catch (error) {
  console.log({error})       
}
}

module.exports = { getItemViews, createView, deleteView, getSingleView, getAllViews, getUserWatchList }
