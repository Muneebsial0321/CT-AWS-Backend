require('dotenv').config()
const http = require('http');
const express = require("express")
const app = express()
const cors = require('cors')
const cookie = require("cookie-parser")
const parser = require("body-parser")
const socketIo = require('socket.io');
const socketHandler = require('./Handlers/socketHandler'); 


// middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(parser.json())
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    origin: process.env.FRONT_URL, // Your frontend URL
    credentials: true
}));
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


app.use('/',require('./Routes/GoogleAuth'))
app.use('/users',require('./Routes/User'))
app.use('/jobs',require('./Routes/Job'))
app.use('/events',require('./Routes/Event'))
app.use('/podcasts',require('./Routes/Podcast'))
app.use('/admin',require('./Routes/Dashboard'))
app.use('/upload',require('./Routes/Videos'))


// routes end


// Use the socket handler
socketHandler(io);

server.listen(process.env.PORT,()=>{console.log(`listening to port ${process.env.PORT}`)}) 