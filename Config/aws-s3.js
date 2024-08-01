const dotenv = require('dotenv')
dotenv.config()
const { fromEnv } = require('@aws-sdk/credential-providers');
const { S3Client} = require('@aws-sdk/client-s3');
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv(),
});

module.exports = s3