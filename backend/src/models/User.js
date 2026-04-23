const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'advisor'], default: 'customer' },
  employeeId: { type: String },
  storeLocation: { type: String },

  // Advisor ↔ Customer linking
  assignedAdvisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // for customers
  assignedCustomerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],             // for advisors

  // LIS — Luxury Intent Score (quiz-based, static)
  lis: {
    score:       { type: Number, default: 0 },
    segment:     { type: String, enum: ['Premium', 'Selective', 'Explorer'], default: 'Explorer' },
    notifPref:   { type: String, enum: ['daily', 'weekly', 'monthly', 'rarely'], default: 'weekly' },
    lastUpdated: { type: Date, default: Date.now },
  },

  // LIRA — real-time scores (updated by ScoreCalculationService)
  lira: {
    esScore:    { type: Number, default: 0 },   // Engagement Score 0–7
    pfScore:    { type: Number, default: 0 },   // Purchase Frequency 0–3
    pfLabel:    { type: String, enum: ['Heavy', 'Regular', 'Rare'], default: 'Rare' },
    cviScore:   { type: Number, default: 0 },   // Customer Value Index 0–10
    cviSegment: { type: String, enum: ['high_priority', 'follow_up', 'low_priority'], default: 'low_priority' },
    bonusBuffer:{ type: Number, default: 0 },   // accumulated bonus signals (applied on next calc)
    lastUpdated:{ type: Date, default: Date.now },
  },

  // Loyalty
  loyaltyPoints: { type: Number, default: 0 },
  totalSpent:    { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
