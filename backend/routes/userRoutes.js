const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, deleteUser } = require('../controllers/userController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

//Adding the middlewear
router.put('/profile', protect, updateUser);
router.delete('/profile', protect, deleteUser);

module.exports = router;