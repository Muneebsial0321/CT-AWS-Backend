const express = require('express');
const router = express.Router();
const {createReport,deleteReport,getAllReports,getItemReports} = require('../Controller/Report');

// Route to create a reply
router.post('/', createReport);
router.get('/', getAllReports);
router.get('/:id', getItemReports);
// router.delete('/:id',deleteReport );

module.exports = router;
