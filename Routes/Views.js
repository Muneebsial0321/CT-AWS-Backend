const express = require('express')
const router = express.Router()
const {createView,deleteView,getItemViews,getSingleView,getAllViews,getUserWatchList} = require('../Controller/Views')

//http://localhost:5000/views/ 
router.get('/',getAllViews)
router.get('/watchlist/:id',getUserWatchList)
router.post('/',createView)



module.exports = router