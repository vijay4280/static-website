const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  key: { type: String, unique: true }, // e.g., home_title, about_text
  value: String,
  type: { type: String, enum: ['text', 'image', 'video'] }
});

module.exports = mongoose.model('Content', ContentSchema);