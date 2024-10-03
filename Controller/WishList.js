const WishList = require('../Schemas/WishList');
const { v4: uuidv4 } = require('uuid');

// Create a new wishlist item
const createWishListItem = async (req, res) => {
    try {
        const _id = uuidv4();
        const newWishListItem = new WishList({_id,...req.body});
        const savedWishListItem = await newWishListItem.save();
        res.status(201).json(savedWishListItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get a specific wishlist item by ID
const getAllWishLists = async (req, res) => {
    try {
        const wishListItem = await WishList.scan().exec()
        res.json({count:wishListItem.length,data:wishListItem});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
const getWishListItemById = async (req, res) => {
    try {
        const wishListItem = await WishList.get(req.params.id);
        if (!wishListItem) {
            return res.status(404).json({ message: 'WishList item not found' });
        }
        res.status(200).json(wishListItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a wishlist item by ID
const deleteWishListItem = async (req, res) => {
    try {
        await WishList.delete(req.params.id);
        res.status(204).json({ message: 'WishList item deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {createWishListItem,deleteWishListItem,getWishListItemById,getAllWishLists}
