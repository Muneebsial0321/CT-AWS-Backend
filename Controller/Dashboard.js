const User = require('../Schemas/User')

  async function find_(params) {
    let scan = await User.scan();
    console.log(scan)
    console.log(params)
    scan = await scan.where('role').contains(params);
    console.log(scan)
    const result = await scan.exec();
    console.log(result)
    return  {count:result.length,data:result};
  }

const getInvesters = async(req,res)=>{
    console.log("investor")
    try {
        const filter =  await find_("invester")
        console.log(filter)
        res.json({count:filter.length,data:filter})   
    } catch (error) {
        res.send(error)
    }

}
const get_Users = async(req,res)=>{
    try {
        const filter =  await  find_("viewer")
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }
    
}
const getEntreperneurs = async(req,res)=>{
    try {
      const filter =  await  find_("entrepreneur")
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }

}
const getBLockedUsers = async(req,res)=>{
    try {
      const filter = await User.scan('isBlocked').eq('true').exec()  
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }

}

const adminAnalytics= async (req,res)=> {

}
// Adjust the path as necessary


const getUsersByDate = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    try {
        // Fetch all users
        const users = await User.scan().exec();

        // Filter users locally
        const todayUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= todayStart && createdAt <= todayEnd;
        });

        const weekUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= weekStart;
        });

        const monthUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= monthStart;
        });

        return res.json({
            count:{
                daily:todayUsers.length,
                weekly:weekUsers.length,
                monthly:monthUsers.length
            },
            todayUsers,
            weekUsers,
            monthUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getViewersByDate = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    try {
        // Fetch all users
        const users = await User.scan('role').eq('viewer').exec();

        // Filter users locally
        const todayUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= todayStart && createdAt <= todayEnd;
        });

        const weekUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= weekStart;
        });

        const monthUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= monthStart;
        });

        return res.json({
            count:{
                daily:todayUsers.length,
                weekly:weekUsers.length,
                monthly:monthUsers.length
            },
            todayUsers,
            weekUsers,
            monthUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getInvestersByDate = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    try {
        // Fetch all users
        const users = await User.scan('role').eq('investor').exec();

        // Filter users locally
        const todayUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= todayStart && createdAt <= todayEnd;
        });

        const weekUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= weekStart;
        });

        const monthUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= monthStart;
        });

        return res.json({
            count:{
                daily:todayUsers.length,
                weekly:weekUsers.length,
                monthly:monthUsers.length
            },
            todayUsers,
            weekUsers,
            monthUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getEntByDate = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    try {
        // Fetch all users
        const users = await User.scan('role').eq('entrepreneur').exec();

        // Filter users locally
        const todayUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= todayStart && createdAt <= todayEnd;
        });

        const weekUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= weekStart;
        });

        const monthUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= monthStart;
        });

        return res.json({
            count:{
                daily:todayUsers.length,
                weekly:weekUsers.length,
                monthly:monthUsers.length
            },
            todayUsers,
            weekUsers,
            monthUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getTicketsByDate = async (req, res) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of the week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    try {
        // Fetch all users
        const users = await User.scan().exec();

        // Filter users locally
        const todayUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= todayStart && createdAt <= todayEnd;
        });

        const weekUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= weekStart;
        });

        const monthUsers = users.filter(user => {
            const createdAt = new Date(user.createdAt);
            return createdAt >= monthStart;
        });

        return res.json({
            count:{
                daily:todayUsers.length,
                weekly:weekUsers.length,
                monthly:monthUsers.length
            },
            todayUsers,
            weekUsers,
            monthUsers
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};




module.exports = {getEntreperneurs,getInvesters,get_Users,getBLockedUsers,getUsersByDate,getViewersByDate,getInvestersByDate,getEntByDate}