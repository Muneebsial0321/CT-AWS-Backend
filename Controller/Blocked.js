const BlockedUser = require('../Schemas/Blocked');
const User = require('../Schemas/User');
const { v4: uuidv4 } = require('uuid');

// Create a new blocked user entry
const createBlockedUser = async (req, res) => {
  try {
    const _id=uuidv4()
    const { userId, blockedId } = req.body;
    if (!userId || !blockedId) {
      return res.status(400).json({ message: 'userID and blockedID are required.' });
    }

    // Create and save a new BlockedUser entry
    const newBlockedUser = new BlockedUser({
      _id,  
      userId,
      blockedId
    });
    const savedBlockedUser = await newBlockedUser.save();
    res.status(201).json(savedBlockedUser);
  } catch (error) {
    console.error('Error creating blocked user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all blocked users for a specific user
const getBlockedUsers = async (req, res) => {
  try {
    const blockedUsers = await BlockedUser.scan().exec();
    const data= await Promise.all(blockedUsers.map(async(e)=>{
      const user= await User.get(e.blockedId)
      return user?user:null
    }))
    const filteredData=data.filter((e)=>e!=null)
    res.status(200).json({count:filteredData.length,data:filteredData,originalData:blockedUsers});
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unblock a user
const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BlockedUser.delete({ _id: id });
    res.status(200).json({ message: 'User unblocked successfully', result });
  } catch (error) {
    console.error('Error unblocking user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBlockedUser,
  getBlockedUsers,
  unblockUser
};
