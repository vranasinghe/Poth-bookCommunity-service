const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/:targetId').get(getReviews);
router.route('/').post(protect, addReview);

module.exports = router;
