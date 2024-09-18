const express = require('express');
const router = express.Router();
const reviewController = require('../Controller/Reviews');  // Assuming the controller is in 'controllers/reviewController.js'

// Create a new review
router.post('/', reviewController.createReview);

// Get all reviews
// router.get('/', reviewController.getAllReviews);

// Get a review by ID
router.get('/:id', reviewController.getAllVideoReviews);
router.get('/', reviewController.getAllReviews);

// Update a review by ID
router.put('/:id', reviewController.updateReviewById);

// Delete a review by ID
router.post('/delete/:id', reviewController.deleteReviewById);

module.exports = router;
