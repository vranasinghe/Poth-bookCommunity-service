const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    targetId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'targetModel'
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['Shop', 'Book']
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
    },
    imageUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);