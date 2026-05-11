const Cart = require('../models/Cart');

const normalizeImagePath = (img) => {
  if (!img || img.startsWith('http') || img.startsWith('data:')) return img;
  // Remove any backslashes and prepend a single slash for relative paths
  return '/' + img.replace(/\\/g, '/');
};

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const cartObj = cart.toObject();
    cartObj.items = cartObj.items.map(item => {
      if (item.product && item.product.images) {
        item.product.images = item.product.images.map(normalizeImagePath);
      }
      return item;
    });

    res.json({ success: true, data: cartObj });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to add to cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    res.json({ success: true, data: updatedCart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to remove from cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to clear cart' });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };