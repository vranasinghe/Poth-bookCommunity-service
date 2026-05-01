const express = require('express');
const router = express.Router();
const { protect, isShopOwner } = require('../middlewares/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');
const {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
    addComment,
    getComments,
} = require('../controllers/blogController');

router.route('/')
    .post(protect, isShopOwner, upload.single('coverImage'), createBlog)
    .get(getBlogs);

router.route('/:id')
    .get(getBlogById)
    .put(protect, isShopOwner, upload.single('coverImage'), updateBlog)
    .delete(protect, isShopOwner, deleteBlog);

// ─── New: Likes & Comments (any logged-in user) ───────────────────────────────
router.route('/:id/like').post(protect, toggleLike);
router.route('/:id/comments')
    .get(getComments)             // Public - anyone can read comments
    .post(protect, addComment);   // Must be logged in to comment

module.exports = router;
