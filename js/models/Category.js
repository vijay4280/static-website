const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: String,        // Drip Irrigation
  slug: String,        // drip-irrigation
  banner: String,      // header image
  order: Number,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Category', CategorySchema);
