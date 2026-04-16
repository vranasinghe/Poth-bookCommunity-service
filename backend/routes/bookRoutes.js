const express = require('express');
const router = express.Router();
const { getBooks, getBookById, getBooksByShop } = require('../controllers/bookController');

router.route('/').get(getBooks);
router.route('/:id').get(getBookById);
router.route('/shop/:shopId').get(getBooksByShop);

module.exports = router;
