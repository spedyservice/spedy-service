const Order = require('../models/Order');
const Cart = require('../models/Cart');
const emailService = require('../utils/sendEmail');

const normalizeImagePath = (img) => {
  if (!img || img.startsWith('http') || img.startsWith('data:')) return img;
  return '/' + img.replace(/\\/g, '/');
};

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'cod' } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Build order items
    const items = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.salePrice || item.product.price,
      quantity: item.quantity,
      image: item.product.images && item.product.images[0]
        ? normalizeImagePath(item.product.images[0])
        : ''
    }));

    const itemsPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 1000 ? 0 : 100;
    const totalPrice = itemsPrice + shippingPrice;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    // Clear cart (important: do this after order is created)
    cart.items = [];
    await cart.save();

    // Send email in background – do NOT await, don't block response
    emailService.sendOrderConfirmation(order, req.user.email)
      .catch(err => console.error('Background email error (order confirmation):', err));

    // Respond immediately
    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to create order' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const orderObj = order.toObject();
    orderObj.items = orderObj.items.map(item => ({
      ...item,
      image: normalizeImagePath(item.image)
    }));

    res.json({ success: true, data: orderObj });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch order' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch orders' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const oldStatus = order.orderStatus;
    order.orderStatus = status;
    order.updatedAt = Date.now();
    await order.save();

    // Send email in background (don't await)
    if (oldStatus !== status && order.user && order.user.email) {
      emailService.sendOrderStatusUpdate(order, order.user.email, oldStatus, status)
        .catch(err => console.error('Background email error (order status):', err));
    }

    res.json({ success: true, message: `Order status updated to ${status}`, data: order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(400).json({ success: false, message: error.message || 'Failed to update order' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    await order.deleteOne();
    res.json({ success: true, message: 'Order deleted permanently' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete order' });
  }
};

module.exports = { createOrder, getOrderById, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder };