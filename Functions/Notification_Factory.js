const Notification = require('../Schemas/Notifications')
const { v4: uuidv4 } = require('uuid');

const Notification_Factory = async (userId,event, tableName,desc_ ) => {
    // event is weather it was created or deleted
    try{
    const adminNote = new Notification({
        _id:uuidv4(),
        createdBy:userId,
        for:'admin',
        // for:process.env.ADMIN_ID,
        notiTitle:`${tableName} was ${event}`,
        notiDesc:`${desc_}`

    })
    if(userId!=null){
        const userNote = new Notification({
            _id:uuidv4(),
            createdBy:userId,
            for:userId,
            notiTitle:`${tableName} was ${event}`,
            notiDesc:`You ${event} a ${tableName}`
            
        })
        await userNote.save()
    }
    await adminNote.save()
    console.log("notifications were created")}
    catch(e){
        console.log("error is ",e)
    }
}


module.exports = Notification_Factory