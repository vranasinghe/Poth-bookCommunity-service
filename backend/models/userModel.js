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
        required: [true, 'Phnoe number is required'],
        minlength: [10, 'Phone number should only contain 10 characters'],
        maxlength: [10, 'Phone number should only contain 10 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: [true, 'Email is already registered'],
        match: [/@/, 'Email must contain @ sign']
    },
    password: {
        type: String,
        required: [true, 'Add a password'],
        minlength: [9, 'Password should be more than 8 characters']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);