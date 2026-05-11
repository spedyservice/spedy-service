const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const { idValidation } = require('../middleware/validation');

router.use(protect);

router.get('/my', getMyOrders);
router.post('/', createOrder);
router.get('/:id', idValidation, getOrderById);

// Admin only
router.get('/', admin, getAllOrders);
router.put('/:id/status', admin, idValidation, updateOrderStatus);
router.delete('/:id', admin, idValidation, deleteOrder);   // ← new

module.exports = router;