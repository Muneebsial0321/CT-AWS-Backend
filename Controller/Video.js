

const { client, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } = require('../Config/aws-dynamoDB')
const { v4: uuidv4 } = require('uuid');
const { GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream'); 
const s3 = require("../Config/aws-s3")
const Video = require('../Schemas/Videos')
const User = require('../Schemas/User')
const Comments = require('../Schemas/VideoComments')
const Reviews = require('../Schemas/Reviews')
const Views = require('../Schemas/Views')



const uploadVideo = async (req, res) => {

  if (!req.file) {
    return res.status(400).send('Error: No file uploaded');
  }
  const userId = req.params.id
  const videoUrl = req.file.location
  const videoName = req.file.key
  const { videoDesc, videoVisibility } = req.body
  const videoTags = req.body.videoTags ? JSON.parse(req.body.videoTags) : ['general']
  console.log({ videoTags })
  console.log({ userId, videoName, videoUrl, videoDesc, videoVisibility, videoTags })
  try {
    const _id = uuidv4();
    const vid = new Video({
      _id,
      userId,
      videoName,
      videoUrl,
      videoDesc,
      videoVisibility,
      videoTags
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
    // console.log({vid:vid.userId})
    const com = await Reviews.scan('reviewItemId').eq(req.params.id).exec()
    // exp
    const _id = uuidv4()
    const viewerId = req.cookies.user || ''
    const viewItemId = req.params.id
    const viewItemType = 'video'
   
    const existingView = await Views.scan()
    .where("viewerId").eq(viewerId)
    .and()
    .where("viewItemId").eq(viewItemId)
    .exec();

  if (existingView.count == 0) {
    const view = new Views({_id,viewItemId,viewerId,viewItemType})
    await view.save()    
  }



    // exp  end

    
    const { password, ...user } = await User.get(vid.userId);
    // res.json({ count:viewerId})
    res.json({ data: vid, commments: com, user: user })
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
  const user = await User.get(req.params.id)
  const myFeed = user.videoTags ? user.videoTags : ['general']
  console.log({myFeed})
  // get videos of that feed
  const videos = await Video.scan().exec()
  // const feed = await Promise.all(videos.map(async (e) => {
  //        for(let i =0;i<myFeed.length;i++){
  //            if(e.videoTags.include(myFeed[i])){
  //             return e
  //            }
  //        }
  // }
  // )
  // )
  const feed = await Promise.all(videos.map(async (video) => {
    if (myFeed.some((pref) => video.videoTags && video.videoTags.includes(pref))) {
      return video;
    }
    return null; // Return null for videos that don't match
  }));

  // Remove null values (non-matching videos)
  const filteredFeed = feed.filter(video => video !== null);
  res.json({filteredFeed})



  // send them...

}
const deleteVideo = async (req, res) => {
  console.log("deleting video")
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