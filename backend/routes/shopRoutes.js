const express = require('express');
const router = express.Router();
const { getShops, getShopById } = require('../controllers/shopController');

router.route('/').get(getShops);
router.route('/:id').get(getShopById);

module.exports = router;
