const Shop = require('../models/shopModel');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate('shopOwner', 'firstName lastName email');
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('shopOwner', 'firstName lastName email');
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new shop
// @route   POST /api/shops
// @access  Private
const createShop = async (req, res) => {
    try {
        const { name, description, location, contactNumber } = req.body;
        
        // Image URL from Cloudinary
        const imageUrl = req.file ? req.file.path : 'https://via.placeholder.com/150';

        const shop = await Shop.create({
            shopOwner: req.user._id,
            name,
            description,
            location,
            contactNumber,
            imageUrl
        });

        res.status(201).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shops by owner
// @route   GET /api/shops/owner/me
// @access  Private
const getShopsByOwner = async (req, res) => {
    try {
        const shops = await Shop.find({ shopOwner: req.user._id });
        res.status(200).json(shops);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a shop
// @route   PUT /api/shops/:id
// @access  Private
const updateShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Check if the user is the shop owner
        if (shop.shopOwner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this shop' });
        }

        const { name, description, contactNumber } = req.body;
        
        // Note: location is specifically NOT updated per requirement
        shop.name = name || shop.name;
        shop.description = description || shop.description;
        shop.contactNumber = contactNumber || shop.contactNumber;

        if (req.file) {
            shop.imageUrl = req.file.path;
        }

        const updatedShop = await shop.save();
        res.status(200).json(updatedShop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a shop
// @route   DELETE /api/shops/:id
// @access  Private
const deleteShop = async (req, res) => {
    console.log(`[DELETE SHOP] Request received. ID: ${req.params.id}, User: ${req.user?._id}`);
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'Shop ID is required' });
        }

        // Atomic delete operation that checks ownership
        const deletedShop = await Shop.findOneAndDelete({ 
            _id: req.params.id, 
            shopOwner: req.user._id 
        });

        if (!deletedShop) {
            console.log(`[DELETE SHOP] Shop not found or user not authorized. ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Shop not found or not authorized' });
        }
        
        console.log(`[DELETE SHOP] Success. ID: ${req.params.id}`);
        res.status(200).json({ message: 'Shop removed successfully' });
    } catch (error) {
        console.error('[DELETE SHOP] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle follow shop
// @route   POST /api/shops/:id/follow
// @access  Private
const toggleFollowShop = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        const userId = req.user._id;
        const alreadyFollowing = shop.followers.some(id => id.equals(userId));

        if (alreadyFollowing) {
            shop.followers = shop.followers.filter(id => !id.equals(userId));
        } else {
            shop.followers.push(userId);
        }

        await shop.save();
        res.status(200).json({ followersCount: shop.followers.length, followed: !alreadyFollowing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getShops,
    getShopById,
    createShop,
    getShopsByOwner,
    updateShop,
    deleteShop,
    toggleFollowShop
};
