const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title']
    },
    author: {
        type: String,
        required: [true, 'Please add an author name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    stockCount: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
