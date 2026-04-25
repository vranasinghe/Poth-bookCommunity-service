const express = require('express');
const router = express.Router();
const { getBooks, getBookById, getBooksByShop, addBook } = require('../controllers/bookController');
const { upload } = require('../utils/cloudinaryConfig');

router.route('/')
    .get(getBooks)
    .post(upload.single('image'), addBook);

router.route('/:id').get(getBookById);
router.route('/shop/:shopId').get(getBooksByShop);

module.exports = router;
