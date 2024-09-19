

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
  const { videoDesc, videoVisibility } = req.body
  console.log({ userId, videoName, videoUrl, videoDesc, videoVisibility })
  try {
    const _id = uuidv4();
    const vid = new Video({
      _id,
      userId,
      videoName,
      videoUrl,
      videoDesc,
      videoVisibility
    })

    await vid.save()

    res.json({ message: "File was uploaded successfully", vid });
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

const getUserVideos = async (req, res) => {
  try {
    const id = req.params.id
    const vid = await Video.scan('userId').eq(id).exec()
    res.json({ count: vid.length, data: vid })
  } catch (error) {
    console.log(error)
    res.json({ message: "error occured", error })
  }

}
const getVideo = async (req, res) => {
  try {
    const vid = await Video.get(req.params.id)
    const com = await Reviews.scan('reviewItemId').eq(req.params.id).exec()
    const { password, ...user } = await User.get(vid.userId);
    res.json({ count: vid.length, data: vid, commments: com, user: user })
  } catch (error) {
    console.log(error)
    res.json({ message: "error occured", error })
  }

}
const getAllVideos = async (req, res) => {
  try {
    console.log("all videos")
    const vid = await Video.scan().exec()
    res.json({ count: vid.length, data: vid })
  } catch (error) {
    console.log(error)
    res.json({ message: "error occured", error })
  }

}
const getMyFeed = async (req, res) => {
  // get user feed
  const user = User.get(req.params.id)
  const myFeed = user.videoPrefrences ? user.videoPrefrences : []
  // get videos of that feed
  const videos = await Promise.all(myFeed.map(async (e) => {
    const vid = await Video.scan('videoTags').contains(e).exec()
    return vid
  }
  )
  )
  res.json(videos)



  // send them...

}
const deleteVideo = async (req, res) => {
  const Id = req.params.id
  const pic = await Video.get(Id)
  const key = pic.videoName;
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    // Optionally, remove the file reference from the database
    await Video.delete(Id);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = { uploadVideo, viewVideo, getMyFeed, getUserVideos, getAllVideos, getVideo, deleteVideo }