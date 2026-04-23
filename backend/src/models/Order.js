const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name:      { type: String },
  brand:     { type: String },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, min: 1 },
  imageKey:  { type: String },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber:   { type: String },
  trackingNumber:{ type: String },
  items:         { type: [orderItemSchema], required: true },
  total:         { type: Number, required: true, min: 0 },
  shippingInfo:  { type: Object },
  shipping:      { type: Object },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
