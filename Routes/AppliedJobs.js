const express = require('express');
const {
 createJobApplication,
 deleteJobApplication,
 getAllJobApplications,
 getJobApplications
} = require('../Controller/AppliedJobs');
const upload = require('../Functions/Upload')
const router = express.Router();

router.post('/',upload.single('resume'), createJobApplication);
router.get('/', getAllJobApplications);
router.get('/:id', getJobApplications);
router.delete('/:id', deleteJobApplication);

module.exports = router;
