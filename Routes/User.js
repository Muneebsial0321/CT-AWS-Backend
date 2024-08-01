const express = require('express')
const router = express.Router()
const {createUser,getUsers} = require('../Controller/User')


router.post('/',createUser)
router.get('/',getUsers)
router.get('/:')
router.get('/:')
router.put('/:')
router.delete('/:')

module.exports = router