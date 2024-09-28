const { v4: uuidv4 } = require('uuid');
const User = require('../Schemas/User')
const Podcasts = require('../Schemas/Podcast')
const Videos = require('../Schemas/Videos')
const Jobs = require('../Schemas/Jobs')
const Events = require('../Schemas/Events')
const Pic = require('../Schemas/Picture')
const jwt = require('jsonwebtoken')


const createUser = async (req, res) => {
    try {
        const Users_PK = uuidv4();
        const signedInBy = 'local'
        // pre check
        const u = await User.scan('email').eq(req.body.email).exec()
        console.log(req.body.email)
        if (u.length == 0) {
            console.log("creating new user")
            const newUser = new User({ Users_PK, signedInBy, ...req.body });
            await newUser.save();
            const data = {
                name: newUser.name,
                Users_PK: newUser.Users_PK,
                role: newUser.role
            }
            //   res.json({Users_PK:newUser.Users_PK});
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
        const { password, ...user } = await User.get(req.params.id);
        const data = await __init__(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user, data });
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
    const videos = await Videos.scan('userId').eq(userId).exec()
    const podcast = await Podcasts.scan('userID').eq(userId).exec()

    let data = { events, videos, podcast, jobs }
    // console.log(data)
    return await data
}
const login = async (req, res) => {
    // const {email,password} = req.body
    console.log("password")
    console.log(req.body)
    res.send().end()
    // console.log({email,password})
    // const user = await User.scan('email').eq(email).exec()
    // const data = await User.get(user[0].Users_PK)
    // // console.log(data)
    // if(password==user[0].password){  
    // const _id = data.Users_PK
    // const payload = {
    //   user: _id
    // }
    // const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    // res.cookie('user',_id);
    // res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
    // res.json({message:"success"})

    // }
    // else if(password!=user[0].password){
    //     res.send("wrong password")
    // }

    // const _id = data.Users_PK
    // const payload = {
    //   user: _id
    // }
    // const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    // res.cookie('user',_id);
    // res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
    // res.redirect('http://localhost:5173/videos');
    // res.json(data)


}

module.exports = { createUser, updateUser, getAllUsers, getUser, deleteUser, searchUser, updateUserPicture, login }