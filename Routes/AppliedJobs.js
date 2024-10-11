const express = require('express');
const {
 createJobApplication,
 deleteJobApplication,
 getAllJobApplications,
 getJobApplications,
 getMyApplications
} = require('../Controller/AppliedJobs');
const upload = require('../Functions/Upload')
const router = express.Router();

router.post('/',upload.single('resume'), createJobApplication);
router.get('/', getAllJobApplications);
router.get('/:id', getJobApplications);
router.get('/my/:id', getMyApplications);
router.delete('/:id', deleteJobApplication);

module.exports = router;
