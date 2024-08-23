
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');



const myMiddleware =(req,res,next) => {
  
    const string= req.cookies.jwt
    try{
        const data = jwt.verify(string, JWT_SECRET);
        req.user = data.user;
        next()
    }
    catch{
        res.json({"error":"private page requires login"})
   
    }

}

module.exports = myMiddleware