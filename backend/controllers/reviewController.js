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

        // Update target average rating
        await updateTargetRating(targetId, targetModel);

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for the logged in user
// @route   GET /api/reviews/me
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate({
                path: 'targetId',
                select: 'title name' // Get title for Book, name for Shop
            });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if review belongs to user
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;

        await review.save();

        // Update target average rating
        await updateTargetRating(review.targetId, review.targetModel);

        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if review belongs to user
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const targetId = review.targetId;
        const targetModel = review.targetModel;

        await review.deleteOne();

        // Update target average rating
        await updateTargetRating(targetId, targetModel);

        res.status(200).json({ message: 'Review removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to update target ratings
const updateTargetRating = async (targetId, targetModel) => {
    const Model = targetModel === 'Book' ? Book : Shop;
    const allReviews = await Review.find({ targetId });
    
    const target = await Model.findById(targetId);
    if (target) {
        if (allReviews.length > 0) {
            target.numReviews = allReviews.length;
            target.averageRating = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;
        } else {
            target.numReviews = 0;
            target.averageRating = 0;
        }
        await target.save();
    }
};

module.exports = {
    getReviews,
    addReview,
    getMyReviews,
    updateReview,
    deleteReview
};