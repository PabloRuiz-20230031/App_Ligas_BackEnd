const mongoose = require('mongoose');

const ligaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
   imagen: {
    type: String, // URL de imagen en Cloudinary
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Liga', ligaSchema);
