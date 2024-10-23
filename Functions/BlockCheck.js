const Block = require('../Schemas/Blocked')

const Block_Check=async(uid,bid)=>{
    const res = await Block.scan()
    .where('userId').eq(uid) 
    .where('blockedId').eq(bid)
    .exec()
    if(res.length>0){
        // res direct
    }
    else{
        // next()
    }
    
}