const Review = require('../Schemas/Reviews');  // Assuming you saved your schema in 'models/review.js'
const User = require('../Schemas/User');  // Assuming you saved your schema in 'models/review.js'
const { v4: uuidv4 } = require('uuid');
// Create a new review
exports.createReview = async (req, res) => {
    try {
        const _id = uuidv4()
        const newReview = new Review({_id, ...req.body});
        const savedReview = await newReview.save();
        res.json({message:"success",savedReview});
    } catch (error) {
        res.status(500).json({ error: 'Error creating review', details: error });
    }
};

// Get all reviews
exports.getAllVideoReviews = async (req, res) => {
    try {
        const reviews = await Review.scan('reviewItemId').eq(req.params.id).exec();
        const m =await Promise.all(reviews.map(async(e) => {
              let {name,picUrl,Users_PK} = await User.get(e.userId)
              return await {...e,sender:{name,picUrl,Users_PK}}
          }))
          
        res.json(m);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews', details: error });
    }
};
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.scan().exec();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews', details: error });
    }
};

// Get a review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.get(req.params.id);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching review', details: error });
    }
};

// Update a review by ID
exports.updateReviewById = async (req, res) => {
    try {
        const updatedReview = await Review.update({ _id: req.params.id }, req.body);
        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: 'Error updating review', details: error });
    }
};

// Delete a review by ID
exports.deleteReviewById = async (req, res) => {
    try {
        const deletedReview = await Review.delete(req.params.id);
        console.log({deletedReview})
        res.status(200).json({ message: 'Review deleted successfully' });
        // if (!deletedReview) {
        //     return res.status(404).json({ error: 'Review not found' });
        // }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting review', details: error });
    }
};
