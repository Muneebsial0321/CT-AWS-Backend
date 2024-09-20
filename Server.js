require('dotenv').config()
const http = require('http');
const express = require("express")
const app = express()
const cors = require('cors')
const cookie = require("cookie-parser")
const bodyParser = require("body-parser")
const socketIo = require('socket.io');
const socketHandler = require('./Handlers/socketHandler'); 
const redirectUri = 'http://localhost:5000/zoom/callback'; 
const axios = require('axios'); 



// middlewares
app.use('/payment/webhook', express.raw({ type: 'application/json' }));
// Increase request payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Or if using body-parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: process.env.FRONT_URL, // Your frontend URL
    credentials: true
}));
// app.use(cors({
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     origin: '*', // Your frontend URL
 
// }));
app.use(cookie())
// middlewares end   


// sockets

const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: "http://localhost:5173", // Adjust to match your React app's URL and port
    },
});

// sockets end



// routes


app.use('/',require('./Routes/GithubAuth'))
app.use('/',require('./Routes/GoogleAuth'))
app.use('/users',require('./Routes/User'))
app.use('/jobs',require('./Routes/Job'))
app.use('/events',require('./Routes/Event'))
app.use('/podcasts',require('./Routes/Podcast'))
app.use('/admin',require('./Routes/Dashboard'))
app.use('/upload',require('./Routes/Videos'))
app.use('/payment',require('./Routes/Stripe'))
app.use('/comments',require('./Routes/Comments'))
app.use('/tickets',require('./Routes/Tickets'))
app.use('/meetings',require('./Routes/Meeting'))
app.use('/chatrooms',require('./Routes/ChatRoom'))
app.use('/notifications',require('./Routes/Notifications'))
app.use('/subscribe',require('./Routes/Subscribe'))
app.use('/reviews',require('./Routes/Reviews'))
app.use('/reply',require('./Routes/Reply'))


// routes end


// Use the socket handler
socketHandler(io);

// for zoom code in frontend
app.get('/zoom/callback', async (req, res) => {
    const { code } = req.query;
    try {
      const response = await axios.post('https://zoom.us/oauth/token', null, {
        params: {
          grant_type: 'authorization_code', 
          code,
          redirect_uri: redirectUri,
        },
        auth: {
          username: process.env.ZOOM_ID,
          password: process.env.ZOOM_SECRET,
        },
      });
  
      const { access_token } = response.data;
      res.redirect(`http://localhost:5173/messages/user1?access_token=${encodeURIComponent(access_token)}`);
    } catch (error) {
      res.status(500).send(error);
    }
  });

server.listen(process.env.PORT,()=>{console.log(`listening to port ${process.env.PORT}`)}) 


// Product.query('category')
//   .eq('Electronics')
//   .sort('descending')
//   .limit(5)
//   .exec()
//   .then((products) => {
//     console.log(products);
//   })
//   .catch((err) => {
//     console.error(err);
//   });