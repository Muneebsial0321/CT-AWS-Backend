const { v4: uuidv4 } = require('uuid');
const Event = require('../Schemas/Events')
const Notification = require('../Schemas/Notifications')
const nf = require('../Functions/Notification_Factory');
const User = require('../Schemas/User');


const createEvent = async (req, res) => {
    try {
        const _id = uuidv4();
        let eventCoverImg =''
        let eventCoverUrl = ''
        let mediaFiles = []
        const eventArray = req.body.eventArray?JSON.parse(req.body.eventArray):[];
        const eventTicketArray = req.body.eventTicketArray?JSON.parse(req.body.eventTicketArray):[];
        // const eventTicketArray = req.body.eventTicketArray
        // const basicTicket    = req.body.basicTicket?+req.body.basicTicket:0;
        // const standardTicket = req.body.standardTicket?+req.body.standardTicketnull:0;
        // const premiumTicket  = req.body.premiumTicket?+req.body.premiumTicket:0;

        if (req.files && req.files.coverImage) {
            eventCoverImg = req.files.coverImage[0].key || '';
            eventCoverUrl = req.files.coverImage[0].location || '';
        }
        if (req.files && req.files.mediaFiles) {
            mediaFiles = req.files.mediaFiles.map(e => ({
                eventMediaName: e.key,
                eventMediaUrl: e.location
            }));
        }
        


        const newEvent = new Event({
            _id,
            ...req.body,
            eventCoverImg,
            eventCoverUrl,
            eventArray,
            eventTicketArray,
            // basicTicket: isNaN(Number(basicTicket)) ? 0 : Number(basicTicket),
            // premiumTicket: isNaN(Number(premiumTicket)) ? 0 : Number(premiumTicket),
            // standardTicket: isNaN(Number(standardTicket)) ? 0 : Number(standardTicket),
            mediaFiles
        });

        console.log({eventTicketArray})
        await newEvent.save();
        const ad = process.env.ADMIN_ID
        await nf(ad,req.body.eventCreatedBy,'created','Event')
        res.json({ message: "success", data: newEvent });
        // console.log("saved")
        //  res.send("done")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const getEvent = async (req, res) => {
    try {
        const event = await Event.get(req.params.id);
        const user =  await User.get(event.eventCreatedBy);
        const speakers =  await Promise.all(event.eventArray.map(async(e)=>{
            const user =  await User.get(e);
            if(user){
                return user
            }
            else{
                null
            }
        }))
        const filterSpeakers = speakers.filter((e)=>e!=null)

        
        if (!event) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({event,user,speakers:filterSpeakers});
        // res.status(200).json({event});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.scan().exec();
        res.json({ count: events.length, data: events });
    } catch (error) {
        console.log(error)
        res.json({ message: error.message });
    }
}
const updateEvent = async (req, res) => {
    try {
        console.log(req.body)

        const event = await Event.update({ _id: req.params.id }, req.body);
        res.status(200).json(event);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}
const deleteEvent = async (req, res) => {
    try {
        await Event.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const searchEvents = async (req, res) => {
    let result = await find_(req.body)
    res.json(result)
}

async function find_(params) {
    let scan = await Event.scan();
    for (const key in params) {
        if (params[key]) {
            scan = await scan.where(key).eq(params[key]);
        }
    }

    const result = await scan.exec();
    console.log(result)
    return { count: result.length, data: result };
}


module.exports = { createEvent, updateEvent, getAllEvents, getEvent, deleteEvent, searchEvents } 