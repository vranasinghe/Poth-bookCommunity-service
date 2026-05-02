const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add a shop name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location/nearest city']
    },
    contactNumber: {
        type: String,
        required: [true, 'Please add a contact number']
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
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

module.exports = mongoose.model('Shop', shopSchema);