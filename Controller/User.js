const {client,PutItemCommand ,GetItemCommand, UpdateItemCommand, DeleteItemCommand ,ScanCommand } = require('../Config/aws-dynamoDB')
const { v4: uuidv4 } = require('uuid');




const createUser = async (req,res)=>{

    try {
       const {name,email,password,role} = req.body
       console.log(req.body)
       const pk = uuidv4();
          const params = {
            TableName: 'Users',
            Item: {
              Users_PK: { S: pk }, // Ensure the type of each attribute is specified
              name: { S: name }, // Similarly, specify the type for 'name'
              email: { S: email }, // Ensure the type of each attribute is specified
              password: { S: password } ,// Similarly, specify the type for 'name'
              role: { S: role } ,// Similarly, specify the type for 'name'
            }
          };
      
          // Create and send the PutItem command
          const command = new PutItemCommand(params);
          const data = await client.send(command);
      
          // Send the response back to the client
          res.send(data);
      
        } catch (err) {
          // Log and respond with the error
          console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
          res.status(500).send({ error: 'Failed to add item', details: err.message });
        }
}
const getUsers = async (req,res)=>{
    const params = {
        TableName: 'Users', // Name of your DynamoDB table
      };
    
      try {
        const command = new ScanCommand(params);
        const data = await client.send(command);
        console.log('Items retrieved:', data.Items);
        res.json(data)
      } catch (err) {
        console.error('Error scanning table:', err);
      }

}
const updateUser = (req,res)=>{}
const deleteUser = (req,res)=>{}
const getAUser = (req,res)=>{}

module.exports = {createUser,getUsers}