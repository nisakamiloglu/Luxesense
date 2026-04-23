const mongoose = require('mongoose');

// Task #49: Seed 5 categories into database
const categorySchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:      { type: String, required: true, trim: true },
  icon:      { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Category', categorySchema);
