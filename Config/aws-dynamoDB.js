const { DynamoDBClient, PutItemCommand,GetItemCommand, UpdateItemCommand, DeleteItemCommand,ScanCommand  } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({ region: 'us-east-1' });
const ddbDocClient = DynamoDBDocumentClient.from(client);


module.exports ={ddbDocClient, client ,PutItemCommand ,GetItemCommand, UpdateItemCommand, DeleteItemCommand,ScanCommand }