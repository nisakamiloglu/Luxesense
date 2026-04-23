const Event = require('../models/Event');
const ScoreSnapshot = require('../models/ScoreSnapshot');
const User = require('../models/User');

const DECAY_INACTIVE_DAYS = 15;
const DECAY_FACTOR = 0.8;
const ES_MAX = 7;
const PF_MAX = 3;

// Normalize a raw count to 0–1 using 3-tier thresholds
function tier(value, high, mid) {
  if (value >= high) return 1.0;
  if (value >= mid)  return 0.4;
  return 0.0;
}

// ── calculateES ──────────────────────────────────────────────────────────────
// Reads last 24h events and computes weighted ES (0–7)
async function calculateES(userId) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [sessions, opens, views, wishlistAdds, purchases, acceptances] = await Promise.all([
    Event.find({ userId, eventType: 'session_end',  occurredAt: { $gte: since } }),
    Event.find({ userId, eventType: 'app_open',     occurredAt: { $gte: since } }),
    Event.find({ userId, eventType: 'product_view', occurredAt: { $gte: since } }),
    Event.find({ userId, eventType: 'wishlist_add', occurredAt: { $gte: since } }),
    Event.find({ userId, eventType: 'purchase',     occurredAt: { $gte: since } }),
    Event.find({ userId, eventType: 'advisor_recommendation_accepted', occurredAt: { $gte: since } }),
  ]);

  // session_score: total minutes in sessions today
  const totalMinutes = sessions.reduce((s, e) => s + (e.metadata?.durationMinutes || 0), 0);
  const sessionScore = tier(totalMinutes, 15, 5);

  // opens_score: number of app opens
  const opensScore = tier(opens.length, 5, 2);

  // views_score: product detail views
  const viewsScore = tier(views.length, 5, 1);

  // wishlist_score: wishlist-to-purchase conversion rate (all-time)
  const allWishlistAdds = await Event.countDocuments({ userId, eventType: 'wishlist_add' });
  const allPurchases    = await Event.countDocuments({ userId, eventType: 'purchase' });
  const wishlistRate = allWishlistAdds > 0 ? allPurchases / allWishlistAdds : 0;
  const wishlistScore = tier(wishlistRate, 0.5, 0.15);

  // conversion_score: advisor recommendation acceptance rate (all-time)
  const allRecommendations = await Event.countDocuments({ userId, eventType: 'advisor_recommendation_accepted' });
  // total recommendations sent is tracked in metadata; use count as proxy if not available
  const conversionRate = allRecommendations > 0 ? Math.min(allRecommendations / 10, 1) : 0;
  const conversionScore = tier(conversionRate, 0.4, 0.15);

  const esRaw = sessionScore    * 0.25
              + opensScore      * 0.20
              + viewsScore      * 0.20
              + wishlistScore   * 0.15
              + conversionScore * 0.20;

  const esScaled = parseFloat((esRaw * ES_MAX).toFixed(2));

  return {
    esScore: esScaled,
    kpis: { sessionScore, opensScore, viewsScore, wishlistScore, conversionScore },
  };
}

// ── calculatePF ──────────────────────────────────────────────────────────────
// Counts purchases in the last 30 rolling days → PF score (0, 2, or 3)
async function calculatePF(userId) {
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const count = await Event.countDocuments({
    userId, eventType: 'purchase', occurredAt: { $gte: since30 },
  });

  let pfScore = 0;
  let pfLabel = 'Rare';
  if (count >= 3) { pfScore = 3; pfLabel = 'Heavy'; }
  else if (count >= 1) { pfScore = 2; pfLabel = 'Regular'; }

  return { pfScore, pfLabel, purchaseCount: count };
}

// ── calculateCVI ─────────────────────────────────────────────────────────────
// CVI = ES + PF, capped at 10. Assigns segment.
function calculateCVI(esScore, pfScore) {
  const cviScore = Math.min(parseFloat((esScore + pfScore).toFixed(2)), 10);
  let cviSegment = 'low_priority';
  if (cviScore >= 8) cviSegment = 'high_priority';
  else if (cviScore >= 5) cviSegment = 'follow_up';
  return { cviScore, cviSegment };
}

// ── applyDecay ───────────────────────────────────────────────────────────────
// Returns decayed ES if user has been inactive for ≥15 days.
// Decay does not compound — only applies once per inactivity window.
async function applyDecay(userId, currentES) {
  const lastEvent = await Event.findOne({ userId }).sort({ occurredAt: -1 });
  if (!lastEvent) return { esScore: currentES, decayApplied: false };

  const daysSinceLast = (Date.now() - new Date(lastEvent.occurredAt).getTime()) / 86400000;
  if (daysSinceLast < DECAY_INACTIVE_DAYS) return { esScore: currentES, decayApplied: false };

  // Check if decay was already applied in this inactivity window
  const lastSnapshot = await ScoreSnapshot.findOne({ userId, decayApplied: true })
    .sort({ snapshotDate: -1 });

  if (lastSnapshot) {
    const daysSinceDecay = (Date.now() - new Date(lastSnapshot.snapshotDate).getTime()) / 86400000;
    if (daysSinceDecay < DECAY_INACTIVE_DAYS) {
      return { esScore: currentES, decayApplied: false };
    }
  }

  return {
    esScore: parseFloat((currentES * DECAY_FACTOR).toFixed(2)),
    decayApplied: true,
  };
}

// ── recalculateAndSnapshot ───────────────────────────────────────────────────
// Full recalculation pipeline for one user. Saves snapshot and updates user.
async function recalculateAndSnapshot(userId) {
  const [{ esScore: esRaw, kpis }, { pfScore, pfLabel, purchaseCount }] = await Promise.all([
    calculateES(userId),
    calculatePF(userId),
  ]);

  const { esScore, decayApplied } = await applyDecay(userId, esRaw);
  const { cviScore, cviSegment } = calculateCVI(esScore, pfScore);

  const snapshot = await ScoreSnapshot.create({
    userId, esScore, pfScore, cviScore, cviSegment, kpis, decayApplied,
  });

  await User.findByIdAndUpdate(userId, {
    'lira.esScore':    esScore,
    'lira.pfScore':    pfScore,
    'lira.pfLabel':    pfLabel,
    'lira.cviScore':   cviScore,
    'lira.cviSegment': cviSegment,
    'lira.lastUpdated': new Date(),
  });

  return { esScore, pfScore, pfLabel, purchaseCount, cviScore, cviSegment, kpis, decayApplied };
}

module.exports = { calculateES, calculatePF, calculateCVI, applyDecay, recalculateAndSnapshot };
