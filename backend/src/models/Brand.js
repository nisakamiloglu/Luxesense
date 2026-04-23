const mongoose = require('mongoose');

// Task #48: Seed 8 brands into database
const brandSchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, uppercase: true, trim: true },
  name:      { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Brand', brandSchema);
