const { v4: uuidv4 } = require('uuid');
const Report = require('../Schemas/Report')


const createReport = async(req,res)=>{
    try {
        const _id = uuidv4()
        const report = new Report({_id,...req.body})
        await report.save()
        res.json({message:"success",data:report})
        
    } catch (error) {
        console.log(error)
        res.json({message:"error",error})
        
    }
}
const getAllReports = async(req,res)=>{
    try {
        const data = await Report.scan().exec()
        res.json({count:data.length,data:data})
    } catch (error) {
        console.log(error)
        res.json({message:"error",error})
}
}
const getItemReports = async(req,res)=>{
    try {
        const data = await Report.scan('reportItemId')
        .eq(req.params.id)
        .exec()
        res.json({count:data.length,data:data})
    } catch (error) {
        console.log(error)
        res.json({message:"error",error})
}
}
const deleteReport = async(req,res)=>{}

module.exports = {createReport,getAllReports,getItemReports,deleteReport}