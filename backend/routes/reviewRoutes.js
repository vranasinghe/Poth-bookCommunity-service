const express = require('express');
const router = express.Router();
const {addReview, getshopReviews, getShopReviews} = require('../controllers/reviewController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/', protect, addReview);

router.get('/:shopId', getShopReviews);

module.exports = router;
