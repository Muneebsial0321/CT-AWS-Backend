
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const app = express.Router()
const {client,PutItemCommand  } = require('../Config/aws-dynamoDB')
const { v4: uuidv4 } = require('uuid');



// app.use(cors({
//     origin:"http://localhost:5173",
//     methods:"GET,POST,PUT,DELETE",
//     credentials:true
// }));


// setup session
app.use(session({
    secret:"YOUR SECRET KEY",
    resave:false,
    saveUninitialized:true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:"/auth/google",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        console.log(profile)
        try {
        let user = profile.id
        const name=profile.name.givenName
        const email=profile.email
        const password=''
        const role=''
  

        const pk = uuidv4();
           const params = {
             TableName: 'Users',
             Item: {
               Users_PK: { S: pk }, // Ensure the type of each attribute is specified
               name: { S: name?name:'' }, // Similarly, specify the type for 'name'
               email: { S: email?email:'' }, // Ensure the type of each attribute is specified
               password: { S: password?password:'' } ,// Similarly, specify the type for 'name'
               role: { S: role?role:'' } ,// Similarly, specify the type for 'name'
             }
           };
       
           // Create and send the PutItem command
           const command = new PutItemCommand(params);
           const data__ = await client.send(command);
           console.log('DynamoDB response:', data__);

        // exp end

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user, done) => {
    console.log('Serializing user:', user); // Debug: log user being serialized
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    console.log('Deserializing user:', user); // Debug: log user being deserialized
    done(null, user);
  });

// initial google ouath login
app.get("/auth",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google",passport.authenticate("google",{
    successRedirect:"http://localhost:5173/dashboard",
    failureRedirect:"http://localhost:5173/login" 
}))

// app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }), (req, res) => {
//     // You can add additional logic here if needed
//     res.redirect("http://localhost:5173/dashboard");
// });

app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:5173");
    })
})


module.exports = app