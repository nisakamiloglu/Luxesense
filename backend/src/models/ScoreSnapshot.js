const mongoose = require('mongoose');

const scoreSnapshotSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  esScore:      { type: Number, default: 0 },
  pfScore:      { type: Number, default: 0 },
  cviScore:     { type: Number, default: 0 },
  cviSegment:   { type: String, enum: ['high_priority', 'follow_up', 'low_priority'], default: 'low_priority' },
  // Raw KPI breakdown for transparency
  kpis: {
    sessionScore:    { type: Number, default: 0 },
    opensScore:      { type: Number, default: 0 },
    viewsScore:      { type: Number, default: 0 },
    wishlistScore:   { type: Number, default: 0 },
    conversionScore: { type: Number, default: 0 },
  },
  decayApplied: { type: Boolean, default: false },
  snapshotDate: { type: Date, default: Date.now, index: true },
});

scoreSnapshotSchema.index({ userId: 1, snapshotDate: -1 });

module.exports = mongoose.model('ScoreSnapshot', scoreSnapshotSchema);
