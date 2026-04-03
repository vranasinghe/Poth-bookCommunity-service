const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {firstName, lastName, userType, nearestCity, phoneNumber, email, password} = req.body;

    //Validation: Username or the password should not be empty
    if (!firstName || !email || !userType || !nearestCity || !phoneNumber || !password) {
        return res.status(400).json({message: 'Required fields are needed to be filled'});
    }

    //Checks whether the user already exists
    const userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).json({message: 'User already Exists.'});
    }

    //Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Creating the user in the database
    const user = await User.create({
        firstName,
        lastName,
        userType,
        nearestCity,
        phoneNumber,
        email,
        password: hashedPassword
    });

    if(user){
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName, 
            lastName: user.lastName,   
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(400).json({
            message: 'Invalid user data'
        })
    }
};

const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
};

const loginUser = async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({ email });

    if(!email || !password) {
        return res.status(400).json({message: 'Username and password should not be empty'});
    }
    
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            firstName: user.firstName, 
            lastName: user.lastName, 
            userType: user.userType,
            nearestCity: user.nearestCity,
            phoneNumber: user.phoneNumber,
            email: user.email,
            token: generateToken(user._id)
        });
    }
    else {
        res.status(401).json({message: 'Invalid email or password'});
    }
    
    
}

const updateUser = async(req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.nearestCity = req.body.nearestCity || user.nearestCity;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            token: generateToken(updatedUser._id)
        });
    }
    else {
        res.status(404).json({message: 'User not found'});
    }
}

const deleteUser = async(req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        await user.deleteOne();
        res.json({message: 'User removed successfully'});
    }
    else {
        res.status(404).json({message: 'User not found'});
    }
}

module.exports = {registerUser, loginUser, updateUser, deleteUser};