const Views = require('../Schemas/Views')
const Videos = require('../Schemas/Videos')
const Reviews = require('../Schemas/Reviews')
const User = require('../Schemas/User')
const { v4: uuidv4 } = require('uuid');

const createView = async (req, res) => {
    const _id = uuidv4()
    const view = new Views({
        _id, ...req.body
    })
    await view.save()
    res.json({ message: "success", view })
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

const getUserWatchList = async (req, res) => {

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

module.exports = { getItemViews, createView, deleteView, getSingleView, getAllViews, getUserWatchList }
