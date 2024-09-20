const Reply = require('../Schemas/ReviewsReply')
const { v4: uuidv4 } = require('uuid');


const createReply =async( req,res )=>{
    try {
        const _id=uuidv4()
        const reply = new Reply({_id,...req.body})
        await reply.save()
        res.json({message:success,reply})
    } catch (error) {
         console.log(error)
         res.json({message:"error",error})
}
}
const getAllReply =async( req,res )=>{
    try {
        const reply = await Reply.scan().exec()
        res.json({message:success,reply})
    } catch (error) {
         console.log(error)
         res.json({message:"error",error})
}
}
const getReviewReply =async( req,res )=>{
    try {
        const reply = await Reply.scan('reviewId').eq(req.params.id).exec()
        res.json({count:reply.length,data:reply})
    } catch (error) {
         console.log(error)
         res.json({message:"error",error})
}
}
const deleteReply =async( req,res )=>{
    try {
        const reply = await Reply.delete(req.params.id)
        res.json({message:success,reply})
    } catch (error) {
         console.log(error)
         res.json({message:"error",error})
}
}

module.exports = {createReply,deleteReply,getAllReply,getReviewReply}