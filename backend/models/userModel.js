const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a name']
    },
    lastName: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        required: [true, 'User type is mandatory']    
    },
    nearestCity: {
        type: String,
        required: [true, 'Enter your nearest city']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phnoe number is required']
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: [true, 'Email is already registered']
    },
    password: {
        type: String,
        required: [true, 'Add a password']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);