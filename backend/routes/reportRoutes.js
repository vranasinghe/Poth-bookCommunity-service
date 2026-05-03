const express = require('express');
const router = express.Router();
const { previewReport, createReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

router.get('/preview/:shopId', protect, previewReport);
router.post('/:shopId', protect, upload.single('image'), createReport);
router.get('/', protect, getMyReports);

module.exports = router;
