const mongoose = require('mongoose');

const redSocialSchema = new mongoose.Schema({
  plataforma: {
    type: String,
    enum: ['facebook', 'youtube'],
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('RedSocial', redSocialSchema);
