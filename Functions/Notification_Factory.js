const Notification = require('../Schemas/Notifications')
const { v4: uuidv4 } = require('uuid');

const Notification_Factory = async (adminId,userId,event, tableName ) => {
    // event is weather it was created or deleted
    try{
    const adminNote = new Notification({
        _id:uuidv4(),
        createdBy:userId,
        for:userId,
        notiTitle:`${tableName} was ${event}`,
        notiDesc:`${tableName} was ${event} by user: ${userId}`

    })
    const userNote = new Notification({
        _id:uuidv4(),
        createdBy:userId,
        for:userId,
        notiTitle:`${tableName} was ${event}`,
        notiDesc:`You ${event} a ${tableName}`

    })
    await adminNote.save()
    await userNote.save()
    console.log("notifications were created")}
    catch(e){
        console.log("error is ",e)
    }
}


module.exports = Notification_Factory