const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    shopName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a report title']
    },
    notes: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: null
    },
    breakdown: [{
        bookName: { type: String, required: true },
        stockAmount: { type: Number, required: true }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', reportSchema);
