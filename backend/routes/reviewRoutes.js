const express = require('express');
const router = express.Router();
const { getReviews, addReview, getMyReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

router.route('/me').get(protect, getMyReviews);
router.route('/:targetId').get(getReviews);
router.route('/').post(protect, upload.single('image'), addReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
