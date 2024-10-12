const dotenv = require('dotenv')
dotenv.config()
// const { fromEnv } = require('@aws-sdk/credential-providers');
const multer = require('multer');
const multerS3 = require('multer-s3');
// const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require("../Config/aws-s3")

// // Set up multer and multer-s3
const upload = multer({
    storage: multerS3({
      
        s3: s3,
        acl: 'public-read',
        bucket: process.env.AWS_BUCKET_NAME, 
        key: function (req, file, cb) { 
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
    limits: { fileSize: 7 * 1024 * 1024 }, // Limit file size to 50 MB,
});
module.exports = upload