const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const registerUser = async(req, res) => {
    const {firstName, lastName, userType, nearestCity, phoneNumber, email, password} = req.body;

    if(!firstName || !userType || !nearestCity || !phoneNumber || !email || !password) {
        return res.status(400).json({message: 'All the required fields should be filled'});
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        return res.status(401).json({message: 'User exists'})
    }

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        firstName,
        lastName,
        userType,
        nearestCity,
        phoneNumber,
        email,
        password: hashedPassword
    });

    if(user) {
        res.status(200).json({
            _id: user.id,
            firstName: user.firstName,
            lastName : user.lastName,
            userType : user.userType,
            nearestCity : user.nearestCity,
            phoneNumber : user.phoneNumber,
            email : user.email,
            token : generateToken(user._id)
        });
    } else {
        res.status(400).json({message: 'Invalid user data'});
    }
};

const loginUser = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName : user.lastName,
            userType : user.userType,
            email : user.email,
            token : generateToken(user._id)
        });
    } else {
        res.status(401).json({message: 'Invalid credentials'});
    }
};

const updateUser = async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName : updatedUser.lastName,
            email : updatedUser.email,
            token : generateToken(updatedUser._id)
        });
    } else {
        res.status(404).json({message: 'User not found'});
    }
};

const deleteUser = async(req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        await user.deleteOne();
        res.json({message: 'User removed'});
    } else {
        res.status(404).json({message: 'User not found'});
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};