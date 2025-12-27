// js/models/Feature.js
const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  icon: String
});

module.exports = mongoose.model('Feature', FeatureSchema);
