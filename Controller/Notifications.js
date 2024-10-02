const Notification = require('../Schemas/Notifications')
const User = require('../Schemas/User')

const getNotification= async (req, res) => {
    try {
        const notification = await Notification.get(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllNotifications__= async (req, res) => {
    try {
        const notifications = await Notification.scan().exec();
        const data = await Promise.all(notifications.map(async(e)=>{
            if(e.createdBy!=null){
                const user = await User.get(e.createdBy)
                const picUrl = user?user.picUrl:''
                const name = user?user.name:''
                const user_= { Users_PK:e.createdBy,picUrl,name}
                return {...e,user:user_}
            }
            else{
                return {...e,Users_PK:e.createdBy,picUrl:"",name:""}

            }
        }))

        res.status(200).json({count:data.length,data:data});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getMyNotifications= async (req, res) => {
    try {
        const id = req.params.id
        let notifications = await Notification.scan('for').eq(id).exec();
        res.status(200).json({count:notifications.length,data:notifications});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.scan().exec();
        const data = await Promise.all(notifications.map(async (e) => {
            let user_ = { Users_PK: e.createdBy, picUrl: "", name: "" };
            if (e.createdBy) {
                try {
                    const user = await User.get(e.createdBy);
                    if (user) {
                        user_ = { Users_PK: e.createdBy, picUrl: user.picUrl, name: user.name };
                    }
                } catch (userError) {
                    console.error(`Failed to fetch user with ID ${e.createdBy}:`, userError);
                }
            }

            return { ...e, user: user_ };
        }));

        res.status(200).json({ count: data.length, data: data });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: error.message });
    }
};


const deleteNotification=  async (req, res) => {
    try {
        await Notification.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports= {getAllNotifications,getMyNotifications,deleteNotification}