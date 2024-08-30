
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const app = express.Router()
const { client, PutItemCommand } = require('../Config/aws-dynamoDB')
const { v4: uuidv4 } = require('uuid');
const client_ = require('../Middlewares/Client')
const User = require('../Schemas/User')
const jwt = require('jsonwebtoken')

async function find_(params) {
  let scan = await User.scan();
  scan = await scan.where('email').contains(params);
  const result = await scan.exec();
  return { count: result.length, data: result };
}



// setup session
app.use(session({
  secret: "YOUR SECRET KEY",
  resave: false,
  saveUninitialized: true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google",
    scope: ["profile", "email"]
  },

    async (accessToken, refreshToken, profile, done) => {
      console.log(profile)
      try {
        let user = profile.email
        const name = profile.name.givenName
        const email = profile.email
        const password = ''
        const role = ''


        let Users_PK = uuidv4();
        let users = await User.scan('email').eq(email).exec()
        console.log("users")
        console.log({ users })
        if (users.length > 0) {
          Users_PK = users[0].Users_PK
          console.log("user already exists")
        }
        else {
          
          console.log("new user created")
          const user_ = new User({
            Users_PK, name, email, role
          })
          await user_.save()

        }
        // const params = {
        //   TableName: 'Users',
        //   Item: {
        //     Users_PK: { S: pk }, // Ensure the type of each attribute is specified
        //     name: { S: name ? name : '' }, // Similarly, specify the type for 'name'
        //     email: { S: email ? email : '' }, // Ensure the type of each attribute is specified
        //     password: { S: password ? password : '' },// Similarly, specify the type for 'name'
        //     role: { S: role ? role : '' },// Similarly, specify the type for 'name'
        //   }
        // };

        // // Create and send the PutItem command
        // const command = new PutItemCommand(params);
        // const data__ = await client.send(command);
        // console.log('DynamoDB response:', data__);

        // exp end

        return done(null, Users_PK)
      } catch (error) {
        return done(error, null)
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
app.get("/auth", passport.authenticate("google", { scope: ["profile", "email"] }));

// app.get("/auth/google",passport.authenticate("google",{
//     successRedirect:"http://localhost:5173/dashboard",
//     failureRedirect:"http://localhost:5173/login" 
// }))
app.get('/auth/google',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  async (req, res) => {
    // Successful authentication, set a cookie
    const data = await find_(req.user)
    // console.log("data is ")
    // console.log(data.data[0].Users_PK)

    const payload = {
      user: data.data[0].Users_PK
    }
    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);


    res.cookie('user', data.data[0].Users_PK);
    res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
    res.redirect('http://localhost:5173/videos');
  }
);



// app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }), (req, res) => {
//     // You can add additional logic here if needed
//     res.redirect("http://localhost:5173/dashboard");
// });

app.get("/login/success", client_, async (req, res) => {
  console.log("user is")
  console.log(req.cookies.user)
  res.json({ "working": "true" })
})


app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect("http://localhost:5173");
  })
})


module.exports = app