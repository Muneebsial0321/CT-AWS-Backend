const {ddbDocClient,ScanCommand,client} = require('../Config/aws-dynamoDB');

// async function searchTable(tableName, searchKey, searchValue) {
//     const params = {
//         TableName: tableName,
//         FilterExpression: "#key = :value",
//         ExpressionAttributeNames: {
//             "#key": 'role',
//         },
//         ExpressionAttributeValues: {
//             ":value": 'investor',
//         },
//     };

//     try {
//         const data = await ddbDocClient.send(new ScanCommand(params));
//         if (!data.Items) {
//             throw new Error("No items found");
//         }
//         return data.Items;
//     } catch (err) {
//         console.error("Error searching table:", err);
//         throw new Error("Could not search table");
//     }
// }


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
        const data = await getAll()
       const filter  =  data.Items.filter( e => e.role.S=='invester' )
        // let filter = data.Items.map((e)=>{console.log()})
        console.log("filter is")
        console.log(filter)
        res.json({count:filter.length,data:filter})   
    } catch (error) {
        res.send(error)
    }

}
const get_Users = async(req,res)=>{
    try {
        const data = await getAll()
       const filter  =  data.Items.filter( e => e.role.S=='user' )
        // let filter = data.Items.map((e)=>{console.log()})
        console.log("filter is")
        console.log(filter)
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }
    
}
const getEntreperneurs = async(req,res)=>{
    try {
        const data = await getAll()
        const filter  =  data.Items.filter( e => e.role.S=='entrepreneur' )
        // let filter = data.Items.map((e)=>{console.log()})
        console.log("filter is")
        console.log(filter)
        res.json({count:filter.length,data:filter})    
    } catch (error) {
        res.send(error)
    }

}


module.exports = {getEntreperneurs,getInvesters,get_Users}