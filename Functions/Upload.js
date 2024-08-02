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
        bucket: process.env.AWS_BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});
module.exports = upload