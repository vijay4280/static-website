// js/models/Carousel.js
const mongoose = require('mongoose');

const CarouselSchema = new mongoose.Schema({
  title: String,
  image: String,
  order: Number,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Carousel', CarouselSchema);
