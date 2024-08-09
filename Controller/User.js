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
        // if (!req.file) {
        //     return res.status(400).send('Error: No file uploaded');
        //   }
      
        //   const picUrl = req.file.location
        //   const picName = req.file.key
        //   console.log(picName,picUrl)
          console.log("email is")
          console.log(req.body)
        //   console.log(req)
          res.send("somthing")
    
        // const user = await User.update({ _id: req.params.id },req.body);
        // res.status(200).json(user);
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