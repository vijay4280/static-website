const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,              // Drip Tubing
  category: String,           // drip-irrigation
  subCategory: String,        // emitting-devices
  image: String,              // uploads/xxx.png
  links: [{
    name: String,             // Plain Lateral
    url: String               // /plain-lateral.html
  }],
  order: Number,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', ProductSchema);
