const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const {addReview, getshopReviews, getShopReviews} = require('../controllers/reviewController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/', protect, addReview);

router.get('/:shopId', getShopReviews);
=======
const { getReviews, addReview, getMyReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

router.route('/me').get(protect, getMyReviews);
router.route('/:targetId').get(getReviews);
router.route('/').post(protect, upload.single('image'), addReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
>>>>>>> 4d706f733b77891101e964359c0b637e67a040e0

module.exports = router;
