const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');
const Shop = require('../models/shopModel');

// @desc    Get reviews for a shop or book
// @route   GET /api/reviews/:targetId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ targetId: req.params.targetId }).populate('user', 'firstName lastName');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    const { targetId, targetModel, rating, comment } = req.body;

    if (!targetId || !targetModel || !rating || !comment) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const review = await Review.create({
            user: req.user._id,
            targetId,
            targetModel,
            rating,
            comment
        });

        // Update average rating and numReviews on the target model
        const Model = targetModel === 'Book' ? Book : Shop;
        const target = await Model.findById(targetId);
        
        if (target) {
            const allReviews = await Review.find({ targetId });
            target.numReviews = allReviews.length;
            target.averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
            await target.save();
        }

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    addReview
};