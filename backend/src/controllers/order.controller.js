const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, total, shippingInfo, shipping } = req.body;
    const orderNumber = `LX${Date.now().toString().slice(-8)}`;
    const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await Order.create({
      userId: req.user.id,
      orderNumber,
      trackingNumber,
      items,
      total,
      shippingInfo,
      shipping,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
