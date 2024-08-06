const { v4: uuidv4 } = require('uuid');
const User = require('../Schemas/User')


const createUser = async(req,res)=>{
    try {
       const _id = uuidv4();
        const newUser = new User({ _id,...req.body});
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getUser= async (req, res) => {
    try {
        const user = await User.get(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllUsers= async (req, res) => {
    try {
        const users = await User.scan().exec();
        res.status(200).json({count:users.length,data:users});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateUser=  async (req, res) => {
    try {
        console.log(req.body)
    
        const user = await User.update({ _id: req.params.id },req.body);
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message:error.message });
    }
}
const deleteUser=  async (req, res) => {
    try {
        await User.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports= {createUser,updateUser,getAllUsers,getUser,deleteUser}