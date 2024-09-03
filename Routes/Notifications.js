const express = require('express')
const router = express.Router()

const {deleteNotification,getAllNotifications,getMyNotifications} = require('../Controller/Notifications')


router.get('/',getAllNotifications)
router.get('/:id',getMyNotifications)
// router.get('/:id',viewVideo)
router.delete('/:id',deleteNotification)

module.exports = router