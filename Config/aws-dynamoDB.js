const { DynamoDBClient, PutItemCommand,GetItemCommand, UpdateItemCommand, DeleteItemCommand,ScanCommand  } = require('@aws-sdk/client-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });


module.exports ={client ,PutItemCommand ,GetItemCommand, UpdateItemCommand, DeleteItemCommand,ScanCommand }