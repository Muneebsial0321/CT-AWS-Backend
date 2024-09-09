
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const app = express.Router()
// const { client, PutItemCommand } = require('../Config/aws-dynamoDB')
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
        let user
        const name = profile.name.givenName
        const email = profile.email
        const role = 'viewer'
        const signedInBy = 'google'

        let Users_PK = uuidv4();
        let users = await User.scan('email').eq(email).exec()
   
        if (users.length > 0) {
          Users_PK = users[0].Users_PK
          user=Users_PK
          
          console.log("user already exists")
          console.log({Users_PK})
        }
        else {
          user=Users_PK
          const user_ = new User({
            Users_PK, name, email, role, signedInBy
          })
          await user_.save()
          console.log("new user created")

        }

        return done(null,user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  // console.log('Serializing user:', user); // Debug: log user being serialized
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // console.log('Deserializing user:', user); // Debug: log user being deserialized
  done(null, user);
});

// initial google ouath login
app.get("/auth", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get('/auth/google',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  async (req, res) => {
    const data = await User.get(req.user)
    // console.log(data.Users_PK)
    const _id = data.Users_PK
    const payload = {
      user: _id
    }
    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie('user',_id);
    res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
    res.redirect('http://localhost:5173/videos');
  }
);


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