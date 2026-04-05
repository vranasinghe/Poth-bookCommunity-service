const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    shop: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Shop'
    },
    rating: {
        type: Number,
        required: [true, 'Add a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Add a comment']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);