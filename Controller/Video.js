

const { client, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('../Config/aws-dynamoDB')
const { v4: uuidv4 } = require('uuid');
const { GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const s3 = require("../Config/aws-s3")
const Video = require('../Schemas/Videos')
const User = require('../Schemas/User')
const Comments = require('../Schemas/VideoComments')
const Reviews = require('../Schemas/Reviews')



const uploadVideo = async (req, res) => {

  if (!req.file) {
    return res.status(400).send('Error: No file uploaded');
  }
  const userId = req.params.id
  const videoUrl = req.file.location
  const videoName = req.file.key
  const{ videoDesc, videoVisibility} =req.body
  console.log({userId, videoName, videoUrl,videoDesc,videoVisibility})
  try {
    const _id = uuidv4();
    // const params = {
    //   TableName: 'Videos',
    //   Item: {
    //     _id: { S: pk },
    //     videoName: { S: videoName },
    //     videoId: { S: userId }, 
    //     videoUrl: { S: videoUrl } 
    //   }
    // };
    // console.log("inserting into db")
    // const command = new PutItemCommand(params);
    // const data = await client.send(command);
    // console.log(data)

    const vid = new Video({
      _id,
      userId,
      videoName,
      videoUrl,
      videoDesc,
      videoVisibility
    })

    await vid.save()

    res.json({message:"File was uploaded successfully",vid});
  } catch (error) {
    console.log("error occured", error)

  }

}
const viewVideo = async (req, res) => {
  console.log("range is")
  console.log(req.headers.range)
  try {

    const key = req.params.id;
    console.log(key)
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    // Stream the response body to the client
    const stream = Readable.from(response.Body);
    stream.pipe(res);
  } catch (error) {
    res.send("error occured")

  }

}

const getUserVideos = async(req,res) =>{
  try { 
    const id = req.params.id
    const vid = await Video.scan('userId').eq(id).exec()
    res.json({count:vid.length,data:vid})
  } catch (error) {
    console.log(error)
    res.json({message:"error occured",error})
  }

}
const getVideo = async(req,res) =>{
  try { 
    const vid = await Video.get(req.params.id)
    const com = await Reviews.scan('reviewItemId').eq(req.params.id).exec()
    const {password,...user} = await User.get(vid.userId);
    res.json({count:vid.length,data:vid,commments:com,user:user})
  } catch (error) {
    console.log(error)
    res.json({message:"error occured",error})
  }

}
const getAllVideos = async(req,res) =>{
  try { 
    console.log("all videos")
    const vid = await Video.scan().exec()
    res.json({count:vid.length,data:vid})
  } catch (error) {
    console.log(error)
    res.json({message:"error occured",error})
  }

}


const viewStream = async (req, res) => {
  const range = req.headers.range;
  const bucketName = process.env.AWS_BUCKET_NAME;
  const key = req.params.id;
  console.log('Received request with range:', range); // Debug: log the range header


  if (!range) {
    res.status(400).send('Requires Range header');
    return;
  }

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    // Get the file size
    const headCommand = new HeadObjectCommand(params);
    const headResponse = await s3.send(headCommand);
    const fileSize = headResponse.ContentLength;
    console.log('File size:', fileSize); // Debug: log the file size

    // Parse Range
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    console.log('Range start:', start, 'Range end:', end); // Debug: log the start and end of the range


    if (start >= fileSize) {
      res.status(416).send(`Requested range not satisfiable\n ${start} >= ${fileSize}`);
      return;
    }

    const chunkSize = (end - start) + 1;

    // Set up range request for S3
    const rangeParams = {
      ...params,
      Range: `bytes=${start}-${end}`,
    };

    // Get the video chunk from S3
    const command = new GetObjectCommand(rangeParams);
    const response = await s3.send(command);

    // Set response headers
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    // Pipe the response body to the client
    const stream = Readable.from(response.Body);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error streaming video');
  }
};

const deleteVideo = async (req, res) => {
  const userId = req.params.id
  const pic = await Video.findOne({ userId: userId })
  const key = pic.videoName;
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // Optionally, remove the file reference from the database
    await Video.deleteOne({ videoName: key });

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = { uploadVideo, viewVideo, viewStream ,getUserVideos,getAllVideos,getVideo}