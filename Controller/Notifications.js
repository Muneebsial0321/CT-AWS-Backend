const Notification = require('../Schemas/Notifications')

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
const getAllNotifications= async (req, res) => {
    try {
        let notifications = await Notification.scan().exec();
        res.status(200).json({count:notifications.length,data:notifications});
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

const deleteNotification=  async (req, res) => {
    try {
        await Notification.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports= {getAllNotifications,getMyNotifications,deleteNotification}