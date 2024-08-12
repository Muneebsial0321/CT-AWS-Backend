 try {
    let eventCoverUrl 
    
    if(req){
        
         eventCoverUrl = req.files.coverImage[0].location | ' '
    }
        console.log(eventCoverUrl)}
 catch(e){
    console.log(e)
 }