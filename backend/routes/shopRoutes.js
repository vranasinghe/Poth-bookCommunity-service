const express = require('express');
const router = express.Router();
const { getShops, getShopById, createShop } = require('../controllers/shopController');
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

router.route('/')
    .get(getShops)
    .post(protect, upload.single('image'), createShop);

router.route('/:id').get(getShopById);

module.exports = router;
