const express = require('express')
const router = express.Router()
const {createView,deleteView,getItemViews,getSingleView,getAllViews} = require('../Controller/Views')

//http://localhost:5000/views/ 
router.get('/',getAllViews)
router.post('/',createView)



module.exports = router