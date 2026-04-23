const mongoose = require('mongoose');

const bonusLogSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  signalType:  { type: String, enum: ['share', 'referral', 'sa_chat'], required: true },
  amount:      { type: Number, required: true },
  referenceId: { type: String }, // URL for share, invitee userId for referral, conversationId for chat
  appliedAt:   { type: Date, default: Date.now },
});

// Ensure one share bonus per URL per user per 24h
bonusLogSchema.index({ userId: 1, signalType: 1, appliedAt: -1 });

module.exports = mongoose.model('BonusLog', bonusLogSchema);
