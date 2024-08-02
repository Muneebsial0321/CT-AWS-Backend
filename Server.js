require('dotenv').config()
const express = require("express")
const app = express()
// const db = require('./Config/aws-dynamoDB')
// const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
// const client = new DynamoDBClient({ region: 'us-east-1' });
app.use(express.json())


app.get('/',(req,res)=>{
    res.send("working")
})

app.use('/users',require('./Routes/User'))
app.use('/admin',require('./Routes/Dashboard'))
app.use('/upload',require('./Routes/Videos'))

// app.post('/', async (req, res) => {
//     try {
//     //   console.log(req.body);
  
//       // Define DynamoDB parameters
//       const params = {
//         TableName: 'Users',
//         Item: {
//           Users_PK: { S: 'dcekxn' }, // Ensure the type of each attribute is specified
//           name: { S: 'fd cd dib' } // Similarly, specify the type for 'name'
//         }
//       };
  
//       // Create and send the PutItem command
//       const command = new PutItemCommand(params);
//       const data = await client.send(command);
  
//       // Send the response back to the client
//       res.send(data);
  
//     } catch (err) {
//       // Log and respond with the error
//       console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
//       res.status(500).send({ error: 'Failed to add item', details: err.message });
//     }
//   });

app.listen(process.env.PORT,()=>{console.log(`listening to port ${process.env.PORT}`)})