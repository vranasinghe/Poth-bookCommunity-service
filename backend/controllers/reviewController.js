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

    res.status(200).json(review);
};

module.exports = { addReview, getShopReviews };