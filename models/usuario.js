const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Correo no válido']
  },
  contraseña: {
    type: String,
    required: true,
    minlength: 6
  },
  foto: {
    type: String,
    default: '' // URL a la imagen (Cloudinary u otro)
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  notificacionesActivas: {
    type: Boolean,
    default: false
  },
  ligasSeguidas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Liga'
  }],
  categoriasSeguidas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria'
  }],
  equiposSeguidos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
