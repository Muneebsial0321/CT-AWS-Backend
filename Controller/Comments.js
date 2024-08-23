const Comment = require('../Schemas/VideoComments')
const { v4: uuidv4 } = require('uuid');

const createComment=async(req,res)=>{
    try {
    const _id = uuidv4();
    const onVideoId = req.params.id
    const comment = new Comment({_id,onVideoId,...req.body})
    await comment.save()
    res.json({"message":"success fully added"}) } 
    catch (error) {
        console.log(error)
        res.json({"message":"error occured",error}) } 
        
    }

const getComments=async(req,res)=>{
    try {
        const id = req.params.id
        let result = await Comment.scan('onVideoId').eq(id).exec();
        res.json({count:result.length,data:result})
    } catch (error) {
        console.log("error is ",error)
        res.send(error)

    }
}
const deleteComments=async(req,res)=>{
    try {
        await Comment.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {deleteComments,getComments,createComment}