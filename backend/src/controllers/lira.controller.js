const User = require('../models/User');
const Event = require('../models/Event');
const ScoreSnapshot = require('../models/ScoreSnapshot');
const { recalculateAndSnapshot } = require('../services/ScoreCalculationService');
const { validateShare, validateReferral, validateSaChat } = require('../services/BonusValidator');

// ── POST /api/lira/events  — ingest a single event from mobile client
exports.ingestEvent = async (req, res, next) => {
  try {
    const { eventType, metadata = {}, occurredAt } = req.body;
    const userId = req.user.id;

    const event = await Event.create({
      userId,
      eventType,
      metadata,
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
    });

    // Trigger immediate score update for high-signal events
    const immediateRecalc = ['purchase', 'chat_initiated', 'advisor_recommendation_accepted'];
    if (immediateRecalc.includes(eventType)) {
      recalculateAndSnapshot(userId).catch(console.error); // fire-and-forget
    }

    res.status(201).json({ success: true, eventId: event._id });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/lira/events/batch  — ingest multiple events (session end flush)
exports.ingestBatch = async (req, res, next) => {
  try {
    const { events = [] } = req.body;
    const userId = req.user.id;

    const docs = events.map(e => ({
      userId,
      eventType: e.eventType,
      metadata:  e.metadata || {},
      occurredAt: e.occurredAt ? new Date(e.occurredAt) : new Date(),
    }));

    await Event.insertMany(docs, { ordered: false });
    recalculateAndSnapshot(userId).catch(console.error);

    res.status(201).json({ success: true, count: docs.length });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/lira/score  — get current scores for logged-in user
exports.getMyScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('lis lira');
    res.json({ success: true, lis: user.lis, lira: user.lira });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/lira/recalculate  — force recalculation (dev/debug)
exports.forceRecalculate = async (req, res, next) => {
  try {
    const result = await recalculateAndSnapshot(req.user.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/lira/bonus/share
exports.bonusShare = async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: 'url required' });

    const result = await validateShare(req.user.id, url);
    if (!result.valid) return res.json({ success: false, reason: result.reason });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'lira.bonusBuffer': result.amount },
    });
    res.json({ success: true, amount: result.amount });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/lira/bonus/referral
exports.bonusReferral = async (req, res, next) => {
  try {
    const { inviteeId } = req.body;
    if (!inviteeId) return res.status(400).json({ success: false, message: 'inviteeId required' });

    const result = await validateReferral(req.user.id, inviteeId);
    if (!result.valid) return res.json({ success: false, reason: result.reason });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'lira.bonusBuffer': result.amount },
    });
    res.json({ success: true, amount: result.amount });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/lira/bonus/chat
exports.bonusChat = async (req, res, next) => {
  try {
    const { conversationId, initiatorRole, messageCount } = req.body;

    const result = await validateSaChat(req.user.id, conversationId, initiatorRole, messageCount);
    if (!result.valid) return res.json({ success: false, reason: result.reason });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'lira.bonusBuffer': result.amount },
    });
    res.json({ success: true, amount: result.amount });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/lira/advisor/clients  — advisor sees all clients with CVI scores
exports.getAdvisorClients = async (req, res, next) => {
  try {
    const advisor = await User.findById(req.user.id);
    if (advisor.role !== 'advisor') {
      return res.status(403).json({ success: false, message: 'Not an advisor' });
    }

    const clients = await User.find({ assignedAdvisorId: req.user.id })
      .select('name email phone lis lira loyaltyPoints totalSpent createdAt')
      .sort({ 'lira.cviScore': -1 }); // highest CVI first

    res.json({ success: true, clients });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/lira/advisor/clients/:clientId/snapshots  — score history
exports.getClientSnapshots = async (req, res, next) => {
  try {
    const snapshots = await ScoreSnapshot.find({ userId: req.params.clientId })
      .sort({ snapshotDate: -1 })
      .limit(30);
    res.json({ success: true, snapshots });
  } catch (error) {
    next(error);
  }
};
