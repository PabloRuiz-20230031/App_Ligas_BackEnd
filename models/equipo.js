const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: true
  },
   imagen: {
    type: String, // URL de imagen en Cloudinary
    default: ''
  },
    descripcion: {
    type: String,
    default: ''
  },
}, {
  timestamps: true
});

// Validar nombre único por categoría
equipoSchema.index({ nombre: 1, categoria: 1 }, { unique: true });

module.exports = mongoose.model('Equipo', equipoSchema);