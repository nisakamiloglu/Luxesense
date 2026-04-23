const Wishlist = require('../models/Wishlist');

exports.getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const item = await Wishlist.findOneAndUpdate(
      { userId: req.user.id, productId },
      { userId: req.user.id, productId },
      { upsert: true, new: true }
    );
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndDelete({ userId: req.user.id, productId: req.params.productId });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
