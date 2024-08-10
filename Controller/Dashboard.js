const {ddbDocClient,ScanCommand,client} = require('../Config/aws-dynamoDB');
const User = require('../Schemas/User')
// const searchUser= async( req,res)=>{
//     let result = await find_(req.body)
//      res.json(result)
//   }

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


const getAll=async()=>{

    const params = {
        TableName: 'Users', // Name of your DynamoDB table
    };
    
    try {
        const command = new ScanCommand(params);
        const data = await client.send(command);
        return data
    } catch (err) {
        console.error('Error scanning table:', err);
    }
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
        const filter =  await  find_("user")
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


module.exports = {getEntreperneurs,getInvesters,get_Users}