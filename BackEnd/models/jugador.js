const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  curp: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: [/^[A-Z][AEIOU][A-Z]{2}\d{6}[HM][A-Z]{2}[A-Z]{3}[0-9A-Z]\d$/, 'CURP no válida']
  },
  dorsal: {
    type: Number,
    required: true,
    min: 0,
    max: 999
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  foto: {
    type: String // Puedes almacenar una URL o nombre de archivo
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  }
}, {
  timestamps: true
});

// Validar que el dorsal sea único por equipo
jugadorSchema.index({ dorsal: 1, equipo: 1 }, { unique: true });

module.exports = mongoose.model('Jugador', jugadorSchema);
