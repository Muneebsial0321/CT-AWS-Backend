// Batch Delete...

// will be given reviewitem id and type batch del all reviews of an item along with their replys....
const delReviews=async(riId,riType)=>{
    // for podcast
    delReplys()
    // for video
    delReplys()
}

// will be given userid and to batch del all its videos along with it
const delVideo=async(userId)=>{
    delWishList()
    delHistory()
    delReviews()
}
const delEvents=async(userId)=>{
    // batch delete events
    delWishList()
}
const delJobs=async()=>{
     // batch delete events
     delWishList()
}
const delPodcasts=async()=>{
     // batch delete events
     delWishList()
     delReviews()
     delHistory()
}
const delUser=async()=>{}
const delReplys=async(reviewId)=>{}
const delViews=async()=>{}
const delNotifications=async()=>{}
const delReport=async()=>{}
const delSubscription=async()=>{}
const delWishList=async()=>{}
const delHistory=async()=>{}


const Delete_Media_From_S3=async(key)=>{
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      };
      const command = new DeleteObjectCommand(params);
      await s3.send(command);
}
catch(e){
    console.log(e)
}
}
