const Blog = require('../models/Blog');

const createBlog = async (req, res) => {
    try {
        const { title, content, author } = req.body;
        // If a cover image was uploaded, save its filename
        const coverImage = req.file ? req.file.path : null;
        const newBlog = new Blog({ title, content, author, coverImage });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // If a new cover image was uploaded, update it
        if (req.file) {
            updateData.coverImage = req.file.path;
        }
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!updatedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBlog,
    getBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
    addComment,
    getComments,
};

// ─── LIKES ────────────────────────────────────────────────────────────────────
async function toggleLike(req, res) {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const userId = req.user._id;
        const alreadyLiked = blog.likes.some(id => id.equals(userId));

        if (alreadyLiked) {
            blog.likes = blog.likes.filter(id => !id.equals(userId)); // Unlike
        } else {
            blog.likes.push(userId); // Like
        }

        await blog.save();
        res.status(200).json({ likes: blog.likes.length, liked: !alreadyLiked });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// ─── COMMENTS ─────────────────────────────────────────────────────────────────
async function addComment(req, res) {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const newComment = {
            userId: req.user._id,
            userName: req.user.firstName + (req.user.lastName ? ' ' + req.user.lastName : ''),
            text: text.trim(),
        };

        blog.comments.push(newComment);
        await blog.save();

        res.status(201).json(blog.comments[blog.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getComments(req, res) {
    try {
        const blog = await Blog.findById(req.params.id).select('comments');
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog.comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

