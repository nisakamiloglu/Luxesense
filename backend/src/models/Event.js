const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  eventType:  {
    type: String,
    required: true,
    enum: [
      'session_end',
      'app_open',
      'product_view',
      'wishlist_add',
      'purchase',
      'share',
      'referral_completed',
      'chat_initiated',
      'advisor_recommendation_accepted',
    ],
  },
  metadata:   { type: mongoose.Schema.Types.Mixed, default: {} },
  occurredAt: { type: Date, default: Date.now, index: true },
});

eventSchema.index({ userId: 1, occurredAt: -1 });
eventSchema.index({ userId: 1, eventType: 1, occurredAt: -1 });

module.exports = mongoose.model('Event', eventSchema);
