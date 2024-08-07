const Sub = require('../Schemas/Subscription')
const { v4: uuidv4 } = require('uuid');

const createSubscription=async(req,res)=>{
    try {
    const _id = uuidv4();
    const subscriberId= req.params.user
    const subscriberToId= req.body.user
    const sub_= new Sub({_id,subscriberId,subscriberToId})
    await sub_.save()
    res.json(sub_) } 
    catch (error) {
        console.log(error)
        
    }
}
const removeSubscription=async(req,res)=>{}