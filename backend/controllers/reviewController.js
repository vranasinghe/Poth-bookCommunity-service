const Review = require('../models/reviewModel');
const Shop = require('../models/shopModel');
const User = require('../models/userModel');

const addReview = async(req, res) => {
    const { shopId, rating, comment } = req.body;

    //Applying the condition "Only users can add reviews"
    if(req.user.userType !== 'Customer') {
        return res.status(403).json({message: 'Only customers can add reviews'});
    }

    //Searching the database for the particular sop
    const shop = await Shop.findById(shopId);
    if(!shop){
        return res.status(404).json({message: 'Shop not found'});
    }

    //Saving the review to the particular shop
    const review = await Review.create({
        customer: req.user.id,
        shop: shopId,
        rating,
        comment
    });

    res.status(201).json(review);
};

const getShopReviews = async (req, res) => {
    const reviews = await Review.find({ shop: req.params.shopId}).populate('customer', 'firstName lastName');

<<<<<<< HEAD
    res.status(200).json(review);
=======
    if (!targetId || !targetModel || !rating || !comment) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const imageUrl = req.file ? req.file.path : null;

        const review = await Review.create({
            user: req.user._id,
            targetId,
            targetModel,
            rating,
            comment,
            imageUrl
        });

        // Update target average rating
        await updateTargetRating(targetId, targetModel);

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
>>>>>>> 4d706f733b77891101e964359c0b637e67a040e0
};

module.exports = { addReview, getShopReviews };