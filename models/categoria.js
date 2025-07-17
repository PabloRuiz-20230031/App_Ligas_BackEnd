const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  liga: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Liga',
    required: true
  },
   imagen: {
    type: String, // URL de imagen en Cloudinary
    default: ''
  },
  descripcion: {
    type: String,
    default: ''
}
}, {
  timestamps: true
});

// Validar nombre único por liga
categoriaSchema.index({ nombre: 1, liga: 1 }, { unique: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
    