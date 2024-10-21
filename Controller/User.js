const { v4: uuidv4 } = require('uuid');
const User = require('../Schemas/User')
const Podcasts = require('../Schemas/Podcast')
const Videos = require('../Schemas/Videos')
const Reviews = require('../Schemas/Reviews')
const Jobs = require('../Schemas/Jobs')
const Events = require('../Schemas/Events')
const Pic = require('../Schemas/Picture')
const jwt = require('jsonwebtoken')
const nf = require('../Functions/Notification_Factory')


const createUser = async (req, res) => {
    try {
        const Users_PK = uuidv4();
        const signedInBy = 'email'
        // pre check
        const u = await User.scan('email').eq(req.body.email).exec()
        console.log(req.body.email)
        if (u.length == 0) {
            console.log("creating new user")
            const newUser = new User({ Users_PK, signedInBy, ...req.body });
            await newUser.save();

            await nf(
                Users_PK, "created", 'user', `A user was created of id:${Users_PK}`
            )
            const data = {
                name: newUser.name,
                Users_PK: newUser.Users_PK,
                role: newUser.role
            }
            const expirationDate = new Date(Date.now() + 3600 * 1000);
            const authtoken = jwt.sign({_id:data.Users_PK}, process.env.JWT_SECRET);
            res.cookie('user', data.Users_PK, { httpOnly: false ,expires: expirationDate});
            res.cookie('jwt', authtoken, { httpOnly: true, secure: true, sameSite: 'None',expires: expirationDate });
            res.json(data);
        }
        else {
            console.log("already a userx")
            res.json({ message: "error", d: "already a user" });
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const getUser = async (req, res) => {
    try {
        const __user__ = await User.get(req.params.id);
        if (__user__) {
            const { password, ...user } = __user__
            const data = await __init__(req.params.id)
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user, data });
        }
        else {
            res.status(200).json({ user: "Does not exist" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllUsers = async (req, res) => {
    try {
        const users = await User.scan().exec();
        const users__ = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.status(200).json({ count: users__.length, data: users__ });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateUser = async (req, res) => {

    try {
        console.log("updating")
        const updateData = { ...req.body };
        const user = await User.update({ Users_PK: req.params.id }, updateData);
        console.log({ "message": "success", data: user })
        res.json({ "message": "success", data: user });
    } catch (error) {
        console.log(error)
        res.json({ message: error.message });
    }
}
const updateUserPicture = async (req, res) => {

    try {
        console.log(req.file)
        if (req.file) {
            // Handle file upload
            const picName = req.file.key;
            const picUrl = req.file.location;
            console.log({ picName, picUrl })
            const user = await User.update({ Users_PK: req.params.id }, { picName, picUrl });
            console.log({ "message": "success", data: user })
            res.json({ "message": "success", data: user });
        }
        else {
            res.send("no picture was uploaded")
        }



    } catch (error) {
        console.log(error)
        res.json({ message: error.message });
    }
}
const deleteUser = async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const searchUser = async (req, res) => {
    let result = await find_(req.body)
    res.json(result)
}
async function find_(params) {
    let scan = await User.scan();
    // console.log(scan)
    // console.log(params)

    for (const key in params) {
        if (params[key]) {
            scan = await scan.where(key).contains(params[key]);
            console.log(scan)
        }
    }

    const result = await scan.exec();
    // console.log(result)
    return { count: result.length, data: result };
}
const __init__ = async (userId) => {
    const events = await Events.scan('eventCreatedBy').eq(userId).exec()
    const jobs = await Jobs.scan('userId').eq(userId).exec()
    const podcast = await Podcasts.scan('userID').eq(userId).exec()

    const videos = await Videos.scan('userId').eq(userId).exec()
    
    
    // get all video data
    
    const videoData= await Promise.all(videos.map(async(e)=>{
        const vid = await Videos.get(e._id)
        const com = await Reviews.scan('reviewItemId').eq(e._id).exec()
        const { password, ...user } = await User.get(vid.userId);
        return { data: vid, reviews: com, user: user }}))
    // get all video data end



    // exp
    const videoReviews = (await Promise.all(videos.map(async (e) => {
        const reviews = await Reviews
            .scan('reviewItemId')
            .eq(e._id)
            .attributes(["reviewRatings"])
            .exec()

        if (reviews.length !== 0) {
            return reviews.map((review) => review.reviewRatings);
        }
        return [];

    }))).flat()


    const podcastReviews = (await Promise.all(podcast.map(async (e) => {
        const reviews = await Reviews
            .scan('reviewItemId')
            .eq(e._id)
            .attributes(["reviewRatings"])
            .exec()
        if (reviews.length !== 0) {
            return reviews.map((review) => review.reviewRatings);
        }
        return [];

    }))).flat()
    // exp end

    // let data ={eventsId,jobsId,videosId,podcastsId}
    let ratingArray = [...videoReviews, ...podcastReviews]
    const rating = {
        globalrating: mean(ratingArray),
        totalRatings: ratingArray.length
    }
    let data = { rating, events, videos:videoData, podcast, jobs }
    return await data
}
const localLogin = async (req, res) => {
    const { email, password } = req.body
    const user = await User.scan('email').eq(email).exec()
    const data = await User.get(user[0].Users_PK)
    // to do to fixed local
    console.log({data,bol:(data.signedInBy == 'local' && data.password == password)})
    if (data.signedInBy == 'email' && data.password == password) {
        const _id = data.Users_PK
        const payload = {
            user: _id
        }
        const expirationDate = new Date(Date.now() + 3600 * 1000);
        const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('user', data.Users_PK, { httpOnly: false ,expires: expirationDate});
        res.cookie('jwt', authtoken, { httpOnly: true, secure: true, sameSite: 'None',expires: expirationDate });
        
        const data_ = {
            name: data.name,
            Users_PK: data.Users_PK,
            role: data.role
        }
        //   res.json({Users_PK:newUser.Users_PK});
        res.redirect('localhost:5173/videos');

    }
    else if (password != user[0].password) {
        res.send("wrong password")
    }
    else{
        res.json({message:"invalid credentials"})

    }

}
const googleLogin = async (req, res) => {
    const { email } = req.body
    const user = await User.scan('email').eq(email).exec()
    const data = await User.get(user[0].Users_PK)
    if (data.signedInBy == 'google') {
        const _id = data.Users_PK
        const payload = {
            user: _id
        }
        const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('user', _id);
        res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
        const data_ = {
            name: data.name,
            Users_PK: data.Users_PK,
            role: data.role
        }
        //   res.json({Users_PK:newUser.Users_PK});
        res.json(data_);

    }
    else {
        res.send("wrong password")
    }

}
const githubLogin = async (req, res) => {
    const { email } = req.body
    const user = await User.scan('email').eq(email).exec()
    const data = await User.get(user[0].Users_PK)
    if (data.signedInBy == 'github') {
        const _id = data.Users_PK
        const payload = {
            user: _id
        }
        const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
        res.cookie('user', _id);
        res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
        const data_ = {
            name: data.name,
            Users_PK: data.Users_PK,
            role: data.role
        }
        //   res.json({Users_PK:newUser.Users_PK});
        res.json(data_);

    }
    else {
        res.send("wrong password")
    }

}
const changePassword=async(req,res)=>{
    try {
    const {oldPass,newPass,userId} = req.body
    const user= await User.get(userId)
    if(user.signedInBy=='email' && user.password == oldPass){
      const updatePass = await User.update({ Users_PK: userId }, {password:newPass});
      if(updatePass){
        res.json({message:"success"})
      }
    }
    else{
        res.json({message:"internal server error"})
    }}
    catch (error) {
        console.log(error)
        res.json({message:"internal server error",error})
    }
}

function mean(arr) {
    if (arr.length === 0) return 0; // Handle empty array case
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}


module.exports = { createUser, updateUser, getAllUsers, getUser, deleteUser, searchUser, updateUserPicture, localLogin, githubLogin, googleLogin ,changePassword}