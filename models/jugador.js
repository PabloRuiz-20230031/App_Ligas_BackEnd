const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  curp: {
    type: String,
    uppercase: true,
    validate: {
      validator: function (v) {
        if (!v) return true; // Acepta vacío
        return /^[A-Z][AEIOU][A-Z]{2}\d{6}[HM][A-Z]{2}[A-Z]{3}[0-9A-Z]\d$/.test(v);
      },
      message: 'CURP no válida'
    }
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
    type: String,
    default: ''
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  }
}, {
  timestamps: true
});

// Índice único: dorsal + equipo
jugadorSchema.index({ dorsal: 1, equipo: 1 }, { unique: true });

module.exports = mongoose.model('Jugador', jugadorSchema);
