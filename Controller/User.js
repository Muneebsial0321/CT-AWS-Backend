const { v4: uuidv4 } = require('uuid');
const User = require('../Schemas/User')
const Pic= require('../Schemas/Picture')


const createUser = async(req,res)=>{
    try {
       const Users_PK  = uuidv4();
        const newUser = new User({ Users_PK ,...req.body});
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const getUser= async (req, res) => {
    try {
        const {password,...user} = await User.get(req.params.id);
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
        const users__ = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.status(200).json({count:users__.length,data:users__});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateUser=  async (req, res) => {

    try {

        const updateData = { ...req.body }; // Start with the request body data
        
        if (req.file) {
            // Handle file upload
            const picName = req.file.key;
            const picUrl = req.file.location;
            updateData.picUrl = picUrl;
            updateData.picName = picName;
        }
            const user = await User.update({ Users_PK: req.params.id },updateData);
            res.json({"message":"success",data:user});
    
        
       
    } catch (error) {
        console.log(error)
        res.json({ message:error.message });
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
const searchUser= async( req,res)=>{
    let result = await find_(req.body)
     res.json(result)
  }

  async function find_(params) {
    let scan = await User.scan();
    console.log(scan)
    console.log(params)
  
    for (const key in params) {
      if (params[key]) {
        scan = await scan.where(key).contains(params[key]);
        console.log(scan)
      }
    }
  
    const result = await scan.exec();
    console.log(result)
    return  {count:result.length,data:result};
  }

module.exports= {createUser,updateUser,getAllUsers,getUser,deleteUser,searchUser}