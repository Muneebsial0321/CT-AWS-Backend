
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const FacebookStrategy = require('passport-facebook').Strategy;
const app = express.Router()
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
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook",
    // scope: ["profile", "email"]
  },

    async (accessToken, refreshToken, profile, done) => {
        console.log("facebook")
      console.log(profile)
      try {
        let user=profile
        const name = user.displayName
        const fbId = profile.id
        const role = 'viewer'
        const signedInBy = 'facebook'
        let Users_PK = uuidv4();
        let users = await User.scan('fbId').eq(fbId).exec()
   
        if (users.length > 0) {
          Users_PK = users[0].Users_PK
          user=Users_PK
          console.log("user already exists")
        //   console.log({Users_PK})
        }
        else {
          user=Users_PK
          const user_ = new User({
            Users_PK, name, fbId, role ,signedInBy
          })
          await user_.save()
          console.log("new user created",user_)

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

// initial github
app.get('/auth', passport.authenticate('facebook', { scope: [ 'email' ] }));

app.get('/auth/facebook', 
    passport.authenticate('facebook', { failureRedirect: '/faliure' }),
    async  (req, res) => {
          const data = await User.get(req.user)
    // console.log(data.Users_PK)
    const _id = data.Users_PK
    const payload = {
      user: _id
    }
    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie('user',_id);
    res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
      res.redirect('http://localhost:5173/videos');  // You can change this to any route
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