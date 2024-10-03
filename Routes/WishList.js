const express = require('express');
const router = express.Router();
const {createWishListItem,deleteWishListItem,getWishListItemById,getAllWishLists} = require('../Controller/WishList')

router.post('/',createWishListItem);
router.get('/', getAllWishLists);
router.get('/:id', getWishListItemById);
router.delete('/:id', deleteWishListItem);

module.exports = router;
