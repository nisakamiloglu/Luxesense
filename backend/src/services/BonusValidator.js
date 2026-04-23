const BonusLog = require('../models/BonusLog');
const Event = require('../models/Event');
const User = require('../models/User');

const DAILY_BONUS_CAP = 1.5;

// Returns total bonus applied to user today
async function todayBonusTotal(userId) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const logs = await BonusLog.find({ userId, appliedAt: { $gte: since } });
  return logs.reduce((s, l) => s + l.amount, 0);
}

// ── Share bonus (+0.3) ───────────────────────────────────────────────────────
// One bonus per URL per user per 24h. Hard limit: 1 share bonus per day.
async function validateShare(userId, url) {
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const alreadyBonused = await BonusLog.findOne({
    userId, signalType: 'share', referenceId: url, appliedAt: { $gte: since24h },
  });
  if (alreadyBonused) return { valid: false, reason: 'URL already bonused in 24h window' };

  const daily = await todayBonusTotal(userId);
  if (daily + 0.3 > DAILY_BONUS_CAP) return { valid: false, reason: 'Daily bonus cap reached' };

  await BonusLog.create({ userId, signalType: 'share', amount: 0.3, referenceId: url });
  return { valid: true, amount: 0.3 };
}

// ── Referral bonus (+0.7 or +0.3) ───────────────────────────────────────────
// Invited user must have completed quiz. Blocks A→B→A circular chains.
async function validateReferral(referrerId, inviteeId) {
  const invitee = await User.findById(inviteeId);
  if (!invitee || !invitee.lis?.score) {
    return { valid: false, reason: 'Invitee has not completed the quiz' };
  }

  // Circular chain detection: check if invitee ever referred the referrer
  const circularLog = await BonusLog.findOne({
    userId: inviteeId, signalType: 'referral', referenceId: referrerId.toString(),
  });
  if (circularLog) return { valid: false, reason: 'Circular referral chain detected' };

  // Check already rewarded for this invitee
  const existing = await BonusLog.findOne({
    userId: referrerId, signalType: 'referral', referenceId: inviteeId.toString(),
  });
  if (existing) return { valid: false, reason: 'Referral already rewarded' };

  const daily = await todayBonusTotal(referrerId);
  const amount = invitee.lis.score >= 12 ? 0.7 : 0.3;
  if (daily + amount > DAILY_BONUS_CAP) return { valid: false, reason: 'Daily bonus cap reached' };

  await BonusLog.create({ userId: referrerId, signalType: 'referral', amount, referenceId: inviteeId.toString() });
  return { valid: true, amount };
}

// ── SA Chat bonus (+1.0) ─────────────────────────────────────────────────────
// User (not SA) must initiate. Conversation must have ≥2 messages total.
async function validateSaChat(userId, conversationId, initiatorRole, messageCount) {
  if (initiatorRole !== 'customer') {
    return { valid: false, reason: 'SA initiated the conversation — no bonus' };
  }
  if (messageCount < 2) {
    return { valid: false, reason: 'Conversation must have ≥2 messages' };
  }

  const existing = await BonusLog.findOne({ userId, signalType: 'sa_chat', referenceId: conversationId });
  if (existing) return { valid: false, reason: 'Chat bonus already applied for this conversation' };

  const daily = await todayBonusTotal(userId);
  if (daily + 1.0 > DAILY_BONUS_CAP) return { valid: false, reason: 'Daily bonus cap reached' };

  await BonusLog.create({ userId, signalType: 'sa_chat', amount: 1.0, referenceId: conversationId });
  return { valid: true, amount: 1.0 };
}

module.exports = { validateShare, validateReferral, validateSaChat };
