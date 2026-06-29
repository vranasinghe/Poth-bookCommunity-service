const express = require('express');
const router = express.Router();
const { 
    addOrder, 
    getReaderOrders, 
    getShopOrders, 
    updateOrderStatus, 
    updateOrderDelivery,
    deleteOrder 
} = require('../controllers/orderController');
const { upload } = require('../utils/cloudinaryConfig');

router.route('/').post(upload.single('paymentSlip'), addOrder);
router.route('/:id').delete(deleteOrder);
router.route('/:id/status').put(updateOrderStatus);
router.route('/:id/delivery').put(updateOrderDelivery);
router.route('/reader/:readerId').get(getReaderOrders);
router.route('/shop/:shopId').get(getShopOrders);

module.exports = router;
