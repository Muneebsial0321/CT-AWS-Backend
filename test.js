const jwt = require("jsonwebtoken")


const my_secret='12345'
const genToken=(payload)=>{
 return jwt.sign(payload,my_secret)
}
const payload={
    "_id":"1322",
    name:"muneeb",
    email:"some email"
}
console.log(genToken(payload))

const verifyToken=(token)=>{
try {
    
    console.log(jwt.verify(token,my_secret))
} catch (error) {
    console.log("redirecting to faliure")
}
    
}
verifyToken(genToken(payload))