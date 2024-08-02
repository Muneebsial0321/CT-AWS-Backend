

const {client,PutItemCommand ,GetItemCommand, UpdateItemCommand, DeleteItemCommand ,ScanCommand } = require('../Config/aws-dynamoDB')
const { v4: uuidv4 } = require('uuid');




  const uploadVideo = async(req,res) =>{
    if (!req.file) {
      return res.status(400).send('Error: No file uploaded');
    }
    const userId = req.params.id
    const videoUrl = req.file.location
    const videoName = req.file.key
    console.log(userId,videoName,videoUrl)
    try {
        const pk = uuidv4();
        const params = {
          TableName: 'Videos',
          Item: {
            _id: { S: pk },
            videoName: { S: videoName },
            videoId: { S: userId }, 
            videoUrl: { S: videoUrl } 
          }
        };
        console.log("inserting into db")
        const command = new PutItemCommand(params);
        const data = await client.send(command);
        console.log(data)
      res.send('File uploaded successfully');
    } catch (error) {
      console.log("error occured",error)
      
    }
  
  }
  const viewVideo = async(req,res) =>{
    try {
      const userId = req.params.id
      const vid = await Video.findOne({userId:userId})
      const key = vid.videoName;
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

  
  const deleteVideo = async (req, res) => {
    const userId = req.params.id
    const pic = await Video.findOne({userId:userId})
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


  module.exports = {uploadVideo}