const Book = require('../models/bookModel');
const Shop = require('../models/shopModel');

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

// @desc    Get books by owner
// @route   GET /api/books/owner/me
// @access  Private
const getBooksByOwner = async (req, res) => {
    try {
        const shops = await Shop.find({ shopOwner: req.user._id });
        const shopIds = shops.map(shop => shop._id);
        const books = await Book.find({ shop: { $in: shopIds } }).populate('shop', 'name');
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

        console.log("Adding book with body:", JSON.stringify(req.body, null, 2));
        if (req.file) console.log("File received:", req.file.path);

        const book = await Book.create({
            title,
            author,
            description,
            price: Number(price),
            imageUrl,
            shop,
            category,
            stockCount: Number(stockCount)
        });

        res.status(201).json(book);
    } catch (error) {
        console.error("Error in addBook - Full Details:", error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({ message: 'Validation Error', details: messages });
        }
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Update book details
// @route   PUT /api/books/:id
// @access  Public (for now)
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('shop');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check ownership
        if (book.shop.shopOwner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this book' });
        }

        if (req.file) {
            req.body.imageUrl = req.file.path;
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Public (for now)
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('shop');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check ownership
        if (book.shop.shopOwner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this book' });
        }

        await book.deleteOne();
        res.status(200).json({ id: req.params.id, message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBooks,
    getBookById,
    getBooksByShop,
    addBook,
    updateBook,
    deleteBook,
    getBooksByOwner
};
