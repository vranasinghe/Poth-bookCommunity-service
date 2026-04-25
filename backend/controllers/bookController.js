const Book = require('../models/bookModel');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().populate('shop', 'name location');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('shop', 'name location');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get books by shop
// @route   GET /api/shops/:shopId/books
// @access  Public
const getBooksByShop = async (req, res) => {
    try {
        const books = await Book.find({ shop: req.params.shopId });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
    try {
        const { title, author, description, price, shop, category, stockCount } = req.body;
        
        // Image URL from Cloudinary (multer-storage-cloudinary provides req.file.path as the URL)
        const imageUrl = req.file ? req.file.path : 'https://via.placeholder.com/150';

        const book = await Book.create({
            title,
            author,
            description,
            price,
            imageUrl,
            shop,
            category,
            stockCount
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBooks,
    getBookById,
    getBooksByShop,
    addBook
};
