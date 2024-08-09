const { v4: uuidv4 } = require('uuid');
const Event = require('../Schemas/Events')


const createEvent = async(req,res)=>{
    try {
       const _id = uuidv4();
        const newEvent = new Event({ _id,...req.body});
        console.log(newEvent)
        await newEvent.save();
        res.json({message:"success",data:newEvent}); 
        console.log("saved")

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getEvent= async (req, res) => {
    try {
        const event = await Event.get(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getAllEvents= async (req, res) => {
    try {
        const events = await Event.scan().exec();
        res.status(200).json({count:events.length,data:events});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateEvent=  async (req, res) => {
    try {
        console.log(req.body)
    
        const event = await Event.update({ _id: req.params.id },req.body);
        res.status(200).json(event);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message:error.message });
    }
}
const deleteEvent=  async (req, res) => {
    try {
        await Event.delete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const searchEvents= async( req,res)=>{
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
    return  {count:result.length,data:result};
  }


module.exports= {createEvent,updateEvent,getAllEvents,getEvent,deleteEvent,searchEvents} 