const User = require('../Schemas/User')

  async function find_(params) {
    let scan = await User.scan();
    console.log(scan)
    console.log(params)
    scan = await scan.where('role').contains(params);
    console.log(scan)
    const result = await scan.exec();
    console.log(result)
    return  {count:result.length,data:result};
  }

const getInvesters = async(req,res)=>{
    console.log("investor")
    try {
        const filter =  await find_("invester")
        console.log(filter)
        res.json({count:filter.length,data:filter})   
    } catch (error) {
        res.send(error)
    }

}
const get_Users = async(req,res)=>{
    try {
        const filter =  await  find_("viewer")
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }
    
}
const getEntreperneurs = async(req,res)=>{
    try {
      const filter =  await  find_("entrepreneur")
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }

}
const getBLockedUsers = async(req,res)=>{
    try {
      const filter = await User.scan('isBlocked').eq('true').exec()  
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }

}

const adminAnalytics= async (req,res)=> {

}


module.exports = {getEntreperneurs,getInvesters,get_Users,getBLockedUsers}