require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')

// middlewares

app.use(express.json())
app.use(cors())

// middlewares end


// routes


app.use('/',require('./Routes/GoogleAuth'))
app.use('/users',require('./Routes/User'))
app.use('/jobs',require('./Routes/Job'))
app.use('/events',require('./Routes/Event'))
app.use('/podcasts',require('./Routes/Podcast'))
app.use('/admin',require('./Routes/Dashboard'))
app.use('/upload',require('./Routes/Videos'))


// routes end


app.listen(process.env.PORT,()=>{console.log(`listening to port ${process.env.PORT}`)})