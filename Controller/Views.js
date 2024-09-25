const Views = require('../Schemas/Views')
const { v4: uuidv4 } = require('uuid');

const createView =async(req,res)=>{
    const _id=uuidv4()
    const view = new Views({
        _id,...req.body
    })
    await view.save()
    res.json({message:"success",view})
}
const getItemViews =async(req,res)=>{}
const getAllViews =async(req,res)=>{
    try {
        const view = await Views.scan().exec()
        res.json({count:view.length,data:view})
    } catch (error) {
        console.log({error})
        res.send(error)
}
}
const deleteView =async(req,res)=>{}
const getSingleView =async(req,res)=>{}

module.exports = {getItemViews,createView,deleteView,getSingleView,getAllViews}
