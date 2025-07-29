const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  section: String, // e.g., section1, section2
  filePath: String, // path to file (e.g., /uploads/file.pdf)
  thumbnail: String // path to image
});

module.exports = mongoose.model('Product', productSchema);
