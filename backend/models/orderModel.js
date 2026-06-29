const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please add a reader'],
        ref: 'User'
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please add a shop'],
        ref: 'Shop'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please add a book'],
        ref: 'Book'
    },
    quantity: {
        type: Number,
        required: [true, 'Please add a quantity'],
        min: 1
    },
    totalPrice: {
        type: Number,
        required: [true, 'Please add a total price'],
        min: [0, 'Total price cannot be negative']
    },
    deliveryDetails: {
        address: { type: String, required: [true, 'Please add delivery address'] },
        city: { type: String, required: [true, 'Please add delivery city'] },
        phone: { type: String, required: [true, 'Please add delivery phone number'], minlength: [10, 'Phone number should only contain 10 characters'], maxlength: [10, 'Phone number should only contain 10 characters'] }
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentSlipUrl: {
        type: String,
        required: [true, 'Please upload a payment slip']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
