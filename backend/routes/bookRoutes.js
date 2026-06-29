const express = require('express');
const router = express.Router();
const { getBooks, getBookById, getBooksByShop, addBook, updateBook, deleteBook, getBooksByOwner } = require('../controllers/bookController');
const { upload } = require('../utils/cloudinaryConfig');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(getBooks)
    .post(protect, upload.single('image'), addBook);

router.get('/owner/me', protect, getBooksByOwner);

router.route('/:id')
    .get(getBookById)
    .put(protect, upload.single('image'), updateBook)
    .delete(protect, deleteBook);
    
router.route('/shop/:shopId').get(getBooksByShop);

module.exports = router;
